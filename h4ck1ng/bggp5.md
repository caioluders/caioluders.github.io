# Binary Golf Grand Prix 5 (BGGP5) Writeup
1735019766

## Introduction
(i was very lazy and made a llm write this)
I recently participated in the Binary Golf Grand Prix 5 (BGGP5), a competition that challenges participants to create the smallest possible files that perform specific tasks. This year's challenge was to create a file under 4096 bytes that downloads a text file from https://binary.golf/5/5 and displays its contents.

In this writeup, I'll walk through my seven different submissions, explain how each works, and the techniques I used to minimize file size.

## The Challenge

The goal of BGGP5 was straightforward:

- Create a file 4096 bytes or less
- Download the text file at https://binary.golf/5/5
- Display the file's contents in some way

The winning entries would be the smallest in each file type category.

## My Submissions

### 1. Python with Requests (64 bytes)

**File size:** 64 bytes

```python
from requests import *;print(get("http://binary.golf/5/5").text)
```

This was my first submission - a straightforward approach using Python's requests library to download and print the content. Nothing fancy, just a baseline solution to get started with the challenge. Really not optimal and was beaten by a lot.

### 2. Python Filename Trick (20 bytes)

**File size:** 20 bytes

```python
exec(__file__[-60:])
```

After my first submission, I realized that many competitors were externalizing code outside the actual file content. For me personally, using command-line arguments or other external elements would feel like cheating, as they're not part of the file itself. However, the filename felt like a legitimate part of the file's identity, so I leveraged that.

The file needs to be named:
```
__import__('os').system('curl -L binary.golf\x2f5\x2f5')#.py
```

The code `exec(__file__[-60:])` executes the last 60 characters of the filename itself. When Python reads `__file__`, it includes the full file path, and the code slices the end portion which contains the command.

When I saw that the winning Python solution was simply `eval(input())` - externalizing all the actual functionality - I felt that traditional programming language categories became less interesting. This led me to explore security tools not originally designed for this purpose, which turned into the theme for my remaining submissions.

### 3. Radare2 (.r2) File (46 bytes) 👑

**File size:** 46 bytes

```
# r2 rdb project file
!curl -L binary.golf/5/5
```

Transitioning to security tools, I started with Radare2, a popular reverse engineering framework. I love using r2 for CTFs and reversing, and I thought it would be fun to leverage its project files for this challenge. The file needs to be placed in a folder named "bggp" and executed with Radare2 from one directory above using:

```
$ r2 -e "dir.projects=./" -p bggp
```

The `!` character in Radare2 allows for executing shell commands, so this simply runs curl to download and display the content.

### 4. HTML (67 bytes)

**File size:** 67 bytes

```html
<a oncut="fetch`//binary.golf/5/5`.then(e=>e.text().then(alert))">5
```

Moving to web technologies, I created this HTML solution using the `oncut` event handler. The winning HTML entry was simply `<body onload=location.href='http://k7.uk'>` - a redirect to a shorter URL than binary.golf. I found this approach similar to the Python tricks - just externalizing the content elsewhere.

Instead, I searched through the PortSwigger XSS cheat sheet (https://portswigger.net/web-security/cross-site-scripting/cheat-sheet) to find the smallest workable event handler. When someone selects the "5" text and performs a cut action (Cmd+X on macOS), the JavaScript code executes a fetch request to download the file and displays its contents using an alert dialog.

The file needs to be served over HTTPS for the fetch to work properly, which adds some complexity for the user but allowed me to keep the code extremely minimal.

### 5. SVG (108 bytes) 👑

**File size:** 108 bytes

```svg
<svg xmlns="http://www.w3.org/2000/svg" oncut="fetch`https:binary.golf/5/5`.then(e=>e.text()).then(alert)"/>
```

Building on the HTML approach, I wanted to see if SVG could offer any advantages. The implementation is similar, using the `oncut` event handler, but SVG files have different parsing rules that can sometimes allow for more compact code or different execution contexts.

When opened in a browser and the user clicks and cuts (Cmd+X on macOS), it fetches the content from the target URL and displays it using an alert.

During development, I found that `fetch\`https:binary.golf/5/5\`` (without the double slashes) is smaller than using the full URL, which helped shave off a few more bytes.

### 6. Nuclei Template (134 bytes) 👑

**File size:** 134 bytes

```yaml
id: a
info: {name: a, author: a}
requests: [{method: GET, path: [https://binary.golf/5/5], extractors: [{type: regex, regex: [.*]}]}]
```

Continuing my exploration of security tools, I turned to Nuclei, a popular vulnerability scanner used in bug bounty hunting. I used several YAML golfing tricks here - like the single-letter identifiers and the compact array notation - to minimize the file size while maintaining valid YAML structure.

When run with:

```
$ nuclei -t nuclei.yaml -target http://127.0.0.1
```

Nuclei will make a GET request to the specified URL and extract the entire content using a regex pattern that matches everything (`.*`), displaying the downloaded content in its output. The target URL doesn't matter here because we're forcing Nuclei to fetch our specific URL in the template.

### 7. Burp Suite Project Settings JSON RCE (216 bytes) 👑

**File size:** 216 bytes

```json
{"bambda":{"logger_capture_filter":{"bambda":"Runtime.getRuntime().exec(new String[]{\"sh\",\"-c\",\"curl -Lo /tmp/5 binary.golf/5/5;open /*/5\"});return true;"}},"logger":{"capture_filter":{"filter_mode":"BAMBDA"}}}
```

Burp Suite is my go-to web proxy for security testing, and I wanted to see if I could leverage it for this challenge. This submission exploits Burp Suite's BAMBDA filter feature, which allows for Java code execution. I discovered this could be used to run arbitrary commands, effectively creating a Remote Code Execution (RCE) from a simple configuration file.

When used as a project configuration file in Burp Suite:

1. Start a new Burp Suite project
2. Select this JSON configuration file
3. Open the browser from Burp Suite's Proxy tab
4. Visit any website

The configuration causes Burp Suite to execute a shell command that downloads the file and opens it, showing its contents. This approach works on both the Professional and Community editions of Burp Suite.

### 8. Burp Suite Project Settings JSON (542 bytes)

**File size:** 542 bytes

```json
{"proxy":{"match_replace_rules":[{"enabled":1,"is_simple_match":false,"rule_type":"response_header","string_match":"^HTTP.*$","string_replace":"HTTP/2 301"},{"enabled":1,"is_simple_match":false,"rule_type":"response_header","string_match":"^Location.*$","string_replace":0},{"enabled":1,"is_simple_match":false,"rule_type":"response_header","string_match":"^Strict-T.*$","string_replace":"Location: https://binary.golf/5/5"},{"enabled":1,"rule_type":"response_header","string_match":"application/octet-stream","string_replace":"text/html"}]}}
```

After the RCE approach with Burp Suite, I wanted to try a more legitimate method using Burp's built-in functionality. This is a more sophisticated approach that uses proxy match-and-replace rules to manipulate HTTP traffic:

1. Replace HTTP response headers to create a 301 redirect
2. Remove any existing Location header
3. Add a new Location header pointing to https://binary.golf/5/5
4. Change the content type to text/html

When a user browses any website through the Burp Suite proxy configured with this file, they'll be redirected to the target URL, displaying its contents. This method doesn't rely on any code execution exploits, just clever use of Burp's legitimate traffic manipulation features.


