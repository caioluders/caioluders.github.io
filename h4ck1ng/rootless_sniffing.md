# Rootless Sniffing

Once upon a time, a noob found a RCE on a server but didn't got root, the noob wanted to sniff the requests that were arriving on that server but didn't know how. That noob is me , and this is my story.

# Scenario 

Okay, ignore the bullshit intro.
I had access to the `www-data` user, and the server was running `Nginx+php-fpm`, how could I sniff the requests without rooting it to run `tcpdump`? The `Nginx` and `php-fpm` master processes run as `root`, but the workers run on `www-data`. Oh, and it was a docker alpine instance, fack.

# Ideias

## Dumping the memory
The first ideia that came to mind was to just dump the memory of the workers via the `/proc/PID/mem` and hope that the requests were there. Here is a nice thread about it [unix.stackexchange.com/questions/6301/how-do-i-read-from-proc-pid-mem-under-linux](https://unix.stackexchange.com/questions/6301/how-do-i-read-from-proc-pid-mem-under-linux) got most of the info there.
The problem that I ran into was that most tools/scripts uses the `ptrace` syscall to attatch to the process before dumping it, and you can't `ptrace` at all on Docker on kernels older than 4.8 without a specific config `--cap-add=SYS_PTRACE` or on `docker-compose.yml` :

```
cap_add:
    - SYS_PTRACE
```

More deep analysis of this on https://jvns.ca/blog/2020/04/29/why-strace-doesnt-work-in-docker/. On Docker running kernels after 4.8 you still can't dump the memory of any of procces, if the `/proc/sys/kernel/yama/ptrace_scope` is set to `1` because it will only allow `ptrace` on childrens of your proccess, if it's set to zero you can dump the memory, but it's `1` by default on most systems. More info on `Yama` on general : https://www.kernel.org/doc/Documentation/security/Yama.txt

Basically I can only dump the memory of a proccess that I executted, not of any proccess running on my user.

## Logs
Editing `Nginx` config to add some logs? No `root` , no way :(

## File Descriptors
The ideia here was that to each request the Nginx was going to open a new file descriptor to that socket and I could dump his contents if I were quick, on `/process/PID/fd/N`. It's a nice ideia , but totally a shot in the dark, as I'm not completely sure if this is how Nginx works. A tool to automatically dump the contents of all file descriptors of a process would be handy. ( TRY TO CODE THAT ) 

## Unix domain socket
Reading through the config file of `php-fpm` I found out that it used a Unix domain socket( link ) to communicate with Nginx using Fastcgi ( link )  , what a horrible name btw. So I began to search for ways of sniffing the Unix domain socket, and turns out it's pretty hard, mainly because it isn't bound to any protocol, and most reliable ways uses PTRACE ATTACH ( GitHub link ), but a dirty hack it's to just rename the socket, everything's a file yadayada, and create a new one that MiTM it ( Stack overflow link ). Nice, the PoC worked locally and I was seeing the FastCGI requests, but this PoC raised had some problems. First that Renaming the socket brought the server down, obviously, and if for some reason I 
PoC gist 

# Conclusions
