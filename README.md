# MessagePack.js [![Build Status](https://travis-ci.org/uupaa/MessagePack.js.png)](http://travis-ci.org/uupaa/MessagePack.js)

[![npm](https://nodei.co/npm/uupaa.messagepack.js.png?downloads=true&stars=true)](https://nodei.co/npm/uupaa.messagepack.js/)

MessagePack implementation

## Document

- [MessagePack.js wiki](https://github.com/uupaa/MessagePack.js/wiki/MessagePack)
- [WebModule](https://github.com/uupaa/WebModule)
    - [Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
    - [Development](https://github.com/uupaa/WebModule/wiki/Development)

## Run on

### Browser and node-webkit

```js
<script src="lib/MessagePack.js"></script>
<script>
var source = { ... };
var packed = MessagePack.encode(source);
var unpacked = MessagePack.decode(packed);

</script>
```

### WebWorkers

```js
importScripts("lib/MessagePack.js");

```

### Node.js

```js
require("lib/MessagePack.js");

```

