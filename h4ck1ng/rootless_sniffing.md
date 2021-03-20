# Rootless Sniffing

Once upon a time, a noob found a RCE on a server but didn't got root, the noob wanted to sniff the requests that were arriving on that server, to escalate privileges, but didn't know how. That noob is me , and this is my story.

# Scenario 

Okay, ignore the bullshit intro.
I had access to the `www-data` user, and the server was running `Nginx+php-fpm`, how could I sniff the requests without rooting it to run `tcpdump`? The `Nginx` and `php-fpm` master processes run as `root`, but the workers run on `www-data`. Oh, and it was a docker alpine instance, fack.

# Ideias

## Dumping the memory
The first ideia that came to mind was to just dump the memory of the Nginx/php workers via the `/proc/PID/mem` and hope that the requests are there. Here is a nice thread about it [unix.stackexchange.com/questions/6301/how-do-i-read-from-proc-pid-mem-under-linux](https://unix.stackexchange.com/questions/6301/how-do-i-read-from-proc-pid-mem-under-linux) got most of the info there.

The problem that I ran into was that most tools/scripts uses the `ptrace` syscall to attatch to the process before dumping it, and you can't `ptrace` at all on Docker on kernels older than 4.8 without a specific config `--cap-add=SYS_PTRACE` or on `docker-compose.yml` :

```
cap_add:
    - SYS_PTRACE
```

More deep analysis of this on https://jvns.ca/blog/2020/04/29/why-strace-doesnt-work-in-docker/.

On Docker running kernels after 4.8 you can use the `process_vm_readv` syscall to dump the memory without attaching to it, but you still can't dump the memory of any of proccess under your user. If the `/proc/sys/kernel/yama/ptrace_scope` is set to `1` it will only allow `ptrace`/`process_vm_readv` if your proccess is the father of the proccess you want to `ptrace`, if it's set to zero you can dump the memory, but it's `1` by default on most systems. More info on `Yama` on general : https://www.kernel.org/doc/Documentation/security/Yama.txt

Basically I can only dump the memory of a proccess that I executed, not of any proccess running on my user. The workers are executed by the masters proccess that run under root :'( So I can't just spawn a new worker from `www-data`.

## Logs
Editing `Nginx` config to add some logs? No `root` , no way :(

## File Descriptors
The ideia here was that to each request the Nginx worker was going to open a new file descriptor to that socket, and I could dump his contents if I'm quick via `/proc/PID/fd/N`. It's a nice ideia , but the only way that I found to achieve this is by copying all the file descriptors using the fairly "new" syscall `pidfd_getfd`, this was introduced on kernel 5.6, with the `pidfd_open` syscall you can open a new file descriptor that refers to another proccess, with that you can use `pidfd_getfd` to copy all file descriptors and use them. We need this because you can't interact with sockets/pipes by just using the file `/proc/PID/fd/N`, this is why you need to copy'em. Now for the sad part: `pidfd_getfd` permissions is governed by `ptrace` (T_T) So this falls at the same problem as dumping the memory.  
 
## Unix domain socket
Reading through the config file of `php-fpm` I found out that it used a [Unix domain socket]( https://en.wikipedia.org/wiki/Unix_domain_socket ) to communicate with Nginx using [Fastcgi]( https://en.wikipedia.org/wiki/FastCGI ) , what a horrible name btw. So I began to search for ways of sniffing the Unix domain socket, and turns out it's pretty hard to properly sniff it, mainly because it isn't bound to any protocol, and most reliable ways uses `ptrace`, but a dirty hack it's to just rename the socket, everything's a file on unix yadayada, and create a new one that MiTM it , like this [superuser.com/a/576404](https://superuser.com/a/576404), using `socat`. Nice, the PoC worked locally and I was seeing the FastCGI requests, but this PoC had some problems.

1. First that renaming the socket brought the server down, obviously.
2. Secondly that if my spoofed socket crashed for some reason the server would also go down. 
3. Thirdly that you shouldn't depend on `socat` as it's a red-flag on any server, and a pretty big binary.

So I made a script that automatizes this whole proccess, and makes sure that if anything goes wrong it will rename the old socket back, and the server will not go offline.

<script src="https://gist-it.appspot.com/github/caioluders/rootless_sniffing/blob/main/dsm.c"></script>

Here's static-linked binaries for red teamming purposes on [github.com/caioluders/rootless_sniffing](https://github.com/caioluders/rootless_sniffing)

# Conclusions
It was really insightfull to go this low on the unix kernel, I'm more of a web guy I guess, and helped a lot to better understand basic authorization flows on the linux kernel. Altho most of my ideas were shit and didn't work, having found that I can spoof the Unix domain socket that the Nginx uses internally is a new technique for me. This can be used on red teaming to escalate privileges, if you weren't able to root it, by getting plain text credentials on a login POST request for example.

I don't know which archictures uses a Unix domain socket on the same way as `Nginx+php-fpm`, but I guess that should exist more contexts that this works, please publish it if you find more scenarios. 

I hope that this is helpfull for someone ^.^
