# Rootless Sniffing

Once upon a time, a noob found a RCE on a server but didn't got root, the noob wanted to sniff the requests that were arriving on that server but didn't know how. That noob is me , and this is my story.

# Scenario 

Okay, ignore the bullshit intro.
I had access to the `www-data` user, and the server was running `Nginx+php-fpm`, how could I sniff the requests without rooting it to run `tcpdump`? The `Nginx` and `php-fpm` master processes run as `root`, but the workers run on `www-data`. Oh, and it was a docker alpine instance, fack.

# Ideias

## Dumping the memory
The first ideia that came to mind was to just dump the memory of the workers via the `/proc/PID/mem` and hope that the requests were there. Here is a nice thread about it [unix.stackexchange.com/questions/6301/how-do-i-read-from-proc-pid-mem-under-linux](https://unix.stackexchange.com/questions/6301/how-do-i-read-from-proc-pid-mem-under-linux) got most of the info there, unfortunately it's somewhat outdated, I'll explain more later.
The problem that I ran into was that most tools/scripts uses PTRACE to attatch to the process before dumping it, and as far as my understanding goes ~sorry if I got something wrong~, this was needed on older kernels to access the memory of another proccess, and you can't PTRACE on Docker without a specific config `--cap-add=SYS_PTRACE` or on `docker-compose.yml` :

```
cap_add:
    - SYS_PTRACE
```

Looks like that a new syscall was introduced to replace `ptrace`, 

https://jvns.ca/blog/2020/04/29/why-strace-doesnt-work-in-docker/
https://gist.github.com/FergusInLondon/fec6aebabc3c9e61e284983618f40730

If I wasn't on docker I could use `gcore`. A tool to automatize this would be nice, I think [mimipenguin](https://github.com/huntergregal/mimipenguin) has a similar ideia but needs root. I'll probably code this later.

## Logs
Editing `Nginx` config to add some logs? No `root` , no way :(

## File Descriptors
The ideia here was that to each request the Nginx was going to open a new file descriptor to that socket and I could dump his contents if I were quick, on `/process/PID/fd/N`. It's a nice ideia , but totally a shot in the dark, as I'm not completely sure if this is how Nginx works. A tool to automatically dump the contents of all file descriptors of a process would be handy. ( TRY TO CODE THAT ) 

## Unix domain socket
Reading through the config file of `php-fpm` I found out that it used a Unix domain socket( link ) to communicate with Nginx using Fastcgi ( link )  , what a horrible name btw. So I began to search for ways of sniffing the Unix domain socket, and turns out it's pretty hard, mainly because it isn't bound to any protocol, and most reliable ways uses PTRACE ATTACH ( GitHub link ), but a dirty hack it's to just rename the socket, everything's a file yadayada, and create a new one that MiTM it ( Stack overflow link ). Nice, the PoC worked locally and I was seeing the FastCGI requests, but this PoC raised had some problems. First that Renaming the socket brought the server down, obviously, and if for some reason I 
PoC gist 

# Conclusions
