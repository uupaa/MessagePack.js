# MessagePack.js [![Build Status](https://travis-ci.org/uupaa/MessagePack.js.svg)](https://travis-ci.org/uupaa/MessagePack.js)

[![npm](https://nodei.co/npm/uupaa.messagepack.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.messagepack.js/)

MessagePack implementation

## Document

- MessagePack.js made of [WebModule](https://github.com/uupaa/WebModule).
- [Spec](https://github.com/uupaa/MessagePack.js/wiki/MessagePack)

## Browser and NW.js(node-webkit)

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/MessagePack.js"></script>
<script>
var source = { ... };
var packed = WebModule.MessagePack.encode(source);
var unpacked = WebModule.MessagePack.decode(packed);
</script>
```

## WebWorkers

```js
importScripts("<module-dir>lib/WebModule.js");
importScripts("<module-dir>lib/MessagePack.js");

```

## Node.js

```js
require("<module-dir>lib/WebModule.js");
require("<module-dir>lib/MessagePack.js");

```

