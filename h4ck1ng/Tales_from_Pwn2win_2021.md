# Tales from Pwn2win 2021
1623898709

## Intro
On the twenty-eight of May occured the Pwn2Win 2021, THE BEST, BIGGEST AND MOST DISORGANIZED CTF OF SOUTH AMERICA ( gnx did not matter at all to that success ). I made two challenges for it and I'm going to tell a little about how they were made, writeups, unintended solutions and a new version of the tool from last post for sniffing/MiTM Unix Domain Sockets.

## Dots Exposed
The first challenge was a Misc challenge about an Esolang called [AsciiDots](https://github.com/aaronjanse/asciidots), I fucking love Esolangs. It was a Arbitrary File Read 0day through importing Libraries, and the objective was to read `/flag` via an AsciiDots program.

I actually began working on that challenge a year ago and made a warmup challenge for Pwn2Win 2020 that achieved partial file read and only if you was able to write to that file, like an PHP session file or a `access_log`. A few weeks prior to Pwn2Win I tried to get arbitrary file read again, and it was incredibly fast to achieve that lol -- like two hours -- turns out that getting a year break from a task really helps (:

### Intended 

AsciiDots is inspired by ASCII Art and works by having it's `dots` travel through the paths, somehow like eletronic circuits ( I know the physics don't work that way, don't hate me plz ). I'm not going to fully dive on how the language works, but will focus on the vulnerability. 

Okay, the only way to read files is via `Libraries`, the ideia it's that you can import other `dots` programs to use on your main program. The first problem occurs here https://github.com/aaronjanse/asciidots/blob/6d5bb842cdfaea7e03e38ca31ce49e4910798c4e/dots/world.py#L178

```python
178         path = os.path.join(dir_path, filename)
```

We can control the `filename` variable via the [lib import](https://ajanse.me/asciidots/language/#libraries) `%!filename`, and it's possible to use an absolute path to import ANY file, `%!/etc/passwd` for example. This will end up in a 
list called `char_obj_array` which has all the characters of the main program and libraries. Let's see an example:


```
%!/etc/hostname a

.a
```

The lists `char_obj_array`/`map` will end up like this

```
%!/etc/hostname a

.a

h0stn4m3
```

```
[['%', '!', '/', 'e', 't', 'c', '/', 'h', 'o', 's', 't', 'n', 'a', 'm', 'e', ' ', 'a'], [], ['.', 'a'], []]
[['h', '0', 's', 't', 'n', '4', 'm', '3'], []]
```

Notice the empty lists and the newline after `.a`? This occurs because the interpreter will `.split('\n')`, this way we can't make an ASCII path to access the imported file's characters and print them, because there is a newline between the library and the original main program.

The second problem is that the interpreter expects that the main program file will end with an `\n`, this is mostly true because some code editors will append a `\n` to the end of the file, Vim for example. This is a clear example of how a simple assumption about the input can cause disastrous outcomes. If our program doesn't end with newline we can make a path to the library's characters. 

With these two bugs we can print all the characters of a library, column by column, and achieve arbitrary file read. 

Final payload:

```
%!/flag a

a

..................................................
||||||||||||||||||||||||||||||||||||||||||||||||||
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
''''''''''''''''''''''''''''''''''''''''''''''''''```

Output:

```CTF-BR{gosh,I_hate_those_fucking_0x0a}```

### Unintended



## Ruthless Monster

### Uninteded 0x1

### Uninteded 0x2

### Intended + Unix Domain Socket Tool


## Memes