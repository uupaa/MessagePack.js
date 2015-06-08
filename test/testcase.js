var ModuleTestMessagePack = (function(global) {

global["BENCHMARK"] = false;

var test = new Test("MessagePack", {
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
        }
    }).add([
        // --- MessagePack ---
        testMessagePack_Nil,
        testMessagePack_Boolean,
        testMessagePack_Float,
        testMessagePack_Uint,
        testMessagePack_Int,
        testMessagePack_String,
        testMessagePack_BooleanArray,
        testMessagePack_Object,
        testMessagePack_ObjectAndArray,
        testMessagePack_InvalidTypes,
        // --- NaN and Infinity ---
        testMessagePack_NaNFloat,
        testMessagePack_NaNDouble,
        testMessagePack_InfinityFloat,
        testMessagePack_InfinityDouble,
        testMessagePack_NaN,
        testMessagePack_Infinity,
        // --- Cyclic Reference Error ---
        testMessagePack_CyclicReferenceError,
        // --- Ext Types ---
        testMessagePack_Bin, // Uint8Array
        testMessagePack_ExtDate,
        testMessagePack_ExtFoo,

        // bench mark
        testMessagePack_vs_JSON_BenchMark,
    ]);

if (IN_BROWSER || IN_NW) {
    test.add([
        // browser and node-webkit test
    ]);
} else if (IN_WORKER) {
    test.add([
        // worker test
    ]);
} else if (IN_NODE) {
    test.add([
        // node.js and io.js test
    ]);
}

// --- test cases ------------------------------------------
function testMessagePack_Nil(test, pass, miss) {
    var cases = {
        "null":     WebModule.MessagePack.decode(WebModule.MessagePack.encode(null)) === null,
        "undefined":WebModule.MessagePack.decode(WebModule.MessagePack.encode(undefined)) == null,
    };
    var result = JSON.stringify(cases, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}
function testMessagePack_Boolean(test, pass, miss) {
    var cases = {
        "f_alse":   WebModule.MessagePack.decode(WebModule.MessagePack.encode(false)) === false,
        "true":     WebModule.MessagePack.decode(WebModule.MessagePack.encode(true)) === true,
    };
    var result = JSON.stringify(cases, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}
function testMessagePack_Float(test, pass, miss) {
    var cases = {
        "-0.0":     WebModule.MessagePack.decode(WebModule.MessagePack.encode(-0.0)) === -0.0,
        "+0.0":     WebModule.MessagePack.decode(WebModule.MessagePack.encode(+0.0)) === +0.0,
        "0.0":      WebModule.MessagePack.decode(WebModule.MessagePack.encode(0.0)) === 0.0,
        "0.1":      WebModule.MessagePack.decode(WebModule.MessagePack.encode(0.1)) === 0.1,            // [0xcb, 0x3f, 0xb9, 0x99, 0x99, 0x99, 0x99, 0x99, 0x9a]
        "0.12":     WebModule.MessagePack.decode(WebModule.MessagePack.encode(0.12)) === 0.12,
        "0.123":    WebModule.MessagePack.decode(WebModule.MessagePack.encode(0.123)) === 0.123,
        "118.625":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(118.625)) === 118.625,    // [203, 64, 93, 168, 0, 0, 0, 0, 0]
        "123.456":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(123.456)) === 123.456,    // [0xcb, 0x40, 0x5e, 0xdd, 0x2f, 0x1a, 0x9f, 0xbe, 0x77]
        "-123.456": WebModule.MessagePack.decode(WebModule.MessagePack.encode(-123.456)) === -123.456,  // [0xcb, 0xc0, 0x5e, 0xdd, 0x2f, 0x1a, 0x9f, 0xbe, 0x77]
        "-0.1":     WebModule.MessagePack.decode(WebModule.MessagePack.encode(-0.1)) === -0.1,          // [0xcb, 0xbf, 0xb9, 0x99, 0x99, 0x99, 0x99, 0x99, 0x9a]
        "1.11":     WebModule.MessagePack.decode(WebModule.MessagePack.encode(1.11)) === 1.11,          // [203, 63, 241, 194, 143, 92, 40, 245, 195]
        "-1.11":    WebModule.MessagePack.decode(WebModule.MessagePack.encode(-1.11)) === -1.11,        // [0xcb, 0xbf, 0xf1, 0xc2, 0x8f, 0x5c, 0x28, 0xf5, 0xc3]
        "3.14159565358979":
                    WebModule.MessagePack.decode(WebModule.MessagePack.encode(3.14159565358979)) === 3.14159565358979,   // [0xcb, 0x40, 0x09, 0x21, 0xfc, 0xe6, 0xeb, 0x64, 0x22]
        "-3.14159565358979":
                    WebModule.MessagePack.decode(WebModule.MessagePack.encode(-3.14159565358979)) === -3.14159565358979, // [0xcb, 0xc0, 0x09, 0x21, 0xfc, 0xe6, 0xeb, 0x64, 0x22]
    };
    var result = JSON.stringify(cases, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}
function testMessagePack_Uint(test, pass, miss) {
    var cases = {
        // FixNum
        "0":    WebModule.MessagePack.decode(WebModule.MessagePack.encode(0)) === 0, // [0x00]
        "1":    WebModule.MessagePack.decode(WebModule.MessagePack.encode(1)) === 1, // [0x01]
        "31":   WebModule.MessagePack.decode(WebModule.MessagePack.encode(31)) === 31, // [0x1f]
        "32":   WebModule.MessagePack.decode(WebModule.MessagePack.encode(32)) === 32, // [0x20]
        "33":   WebModule.MessagePack.decode(WebModule.MessagePack.encode(33)) === 33, // [0x21]
        "126":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(126)) === 126, // [0x7e]
        "127":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(127)) === 127, // [0x7f]
        // Uint8
        "128":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(128)) === 128, // [0xcc, 0x80]
        "129":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(129)) === 129, // [0xcc, 0x81]
        "254":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(254)) === 254, // [0xcc, 0xfe]
        "255":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(255)) === 255, // [0xcc, 0xff]
        // Uint16
        "256":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(256)) === 256, // [0xcd, 0x1, 0x0]
        "257":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(257)) === 257, // [0xcd, 0x1, 0x1]
        "65534":WebModule.MessagePack.decode(WebModule.MessagePack.encode(65534)) === 65534, // [0xcd, 0xff, 0xfe]
        "65535":WebModule.MessagePack.decode(WebModule.MessagePack.encode(65535)) === 65535, // [0xcd, 0xff, 0xff]
        // Uint32
        "65536":WebModule.MessagePack.decode(WebModule.MessagePack.encode(65536)) === 65536, // [0xce, 0x0, 0x1, 0x0, 0x0]
        "65537":WebModule.MessagePack.decode(WebModule.MessagePack.encode(65537)) === 65537, // [0xce, 0x0, 0x1, 0x0, 0x1]
        "4294967295": WebModule.MessagePack.decode(WebModule.MessagePack.encode(4294967295)) === 4294967295, // 0x0ffffffff
        // Uint64
        "4294967296": WebModule.MessagePack.decode(WebModule.MessagePack.encode(4294967296)) === 4294967296, // 0x100000000
        "4294967297": WebModule.MessagePack.decode(WebModule.MessagePack.encode(4294967297)) === 4294967297, // 0x100000001
        "4294967298": WebModule.MessagePack.decode(WebModule.MessagePack.encode(4294967298)) === 4294967298, // 0x100000002
        // IEEE754
        "0x80000000000000": true,   // Accuracy problems. IEEE754
        "0x7fffffffffffffff": true, // Accuracy problems. IEEE754
    };
    var result = JSON.stringify(cases, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}
function testMessagePack_Int(test, pass, miss) {
    var cases = {
        // FixNum
        "-0":           WebModule.MessagePack.decode(WebModule.MessagePack.encode(-0)) === -0, // [0x00]
        "-1":           WebModule.MessagePack.decode(WebModule.MessagePack.encode(-1)) === -1, // [0xff]
        "-31":          WebModule.MessagePack.decode(WebModule.MessagePack.encode(-31)) === -31, // [0xe1]
        // Int8
        "-32":          WebModule.MessagePack.decode(WebModule.MessagePack.encode(-32)) === -32, // [0xe0]
        "-33":          WebModule.MessagePack.decode(WebModule.MessagePack.encode(-33)) === -33, // [0xd0, 0xdf]
        "-64":          WebModule.MessagePack.decode(WebModule.MessagePack.encode(-64)) === -64, // [0xd0, 0xc0]
        "-126":         WebModule.MessagePack.decode(WebModule.MessagePack.encode(-126)) === -126, // [0xd0, 0x82]
        "-127":         WebModule.MessagePack.decode(WebModule.MessagePack.encode(-127)) === -127, // [0xd0, 0x81]
        // Int16
        "-128":         WebModule.MessagePack.decode(WebModule.MessagePack.encode(-128)) === -128, // [0xd1, 0xff, 0x80]
        "-129":         WebModule.MessagePack.decode(WebModule.MessagePack.encode(-129)) === -129, // [0xd1, 0xff, 0x7f]
        "-254":         WebModule.MessagePack.decode(WebModule.MessagePack.encode(-254)) === -254, // [0xd1, 0xff, 0x02]
        "-255":         WebModule.MessagePack.decode(WebModule.MessagePack.encode(-255)) === -255, // [0xd1, 0xff, 0x01]
        // Int16
        "-256":         WebModule.MessagePack.decode(WebModule.MessagePack.encode(-256)) === -256, // [0xd1, 0xff, 0x00]
        "-257":         WebModule.MessagePack.decode(WebModule.MessagePack.encode(-257)) === -257, // [0xd1, 0xfe, 0xff]
        "-32767":       WebModule.MessagePack.decode(WebModule.MessagePack.encode(-32767)) === -32767, // [0xd1, 0x80, 0x01]
        "-32768":       WebModule.MessagePack.decode(WebModule.MessagePack.encode(-32768)) === -32768, // [0xd2, 0xff, 0xff, 0x80, 0x00]
        "-32769":       WebModule.MessagePack.decode(WebModule.MessagePack.encode(-32769)) === -32769, // [0xd2, 0xff, 0xff, 0x7f, 0xff]
        "-65534":       WebModule.MessagePack.decode(WebModule.MessagePack.encode(-65534)) === -65534, // [0xd2, 0xff, 0xff, 0x00, 0x02]
        "-65535":       WebModule.MessagePack.decode(WebModule.MessagePack.encode(-65535)) === -65535, // [0xd2, 0xff, 0xff, 0x00, 0x01]
        // Int32
        "-65536":       WebModule.MessagePack.decode(WebModule.MessagePack.encode(-65536)) === -65536, // [0xd2, 0xff, 0xff, 0x00, 0x00]
        "-65537":       WebModule.MessagePack.decode(WebModule.MessagePack.encode(-65537)) === -65537, // [0xd2, 0xff, 0xfe, 0xff, 0xff]
        "-1048576":     WebModule.MessagePack.decode(WebModule.MessagePack.encode(-1048576)) === -1048576, // [0xd2, 0xff, 0xf0, 0x00, 0x00]
        "-2147483646":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(-2147483646)) === -2147483646, // [0xd2, 0x80, 0x00, 0x00, 0x02]
        "-2147483647":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(-2147483647)) === -2147483647, // [0xd2, 0x80, 0x00, 0x00, 0x01]
        // Int64
        "-2147483648":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(-2147483648)) === -2147483648, // [0xd3, 0xff, 0xff, 0xff, 0xff, 0x80, 0x00, 0x00, 0x00]
        "-4294967293":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(-4294967293)) === -4294967293, // [0xd3, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x03]
        "-4294967294":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(-4294967294)) === -4294967294, // [0xd3, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x02]
        "-4294967295":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(-4294967295)) === -4294967295, // [0xd3, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x01] -4294967295(-0x0ffffffff)
        "-4294967296":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(-4294967296)) === -4294967296, // [0xd3, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00] -4294967296(-0x100000000)
        "-4294967297":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(-4294967297)) === -4294967297, // [0xd3, 0xff, 0xff, 0xff, 0xfe, 0xff, 0xff, 0xff, 0xff] -4294967297(-0x100000001)
        "-4294967298":  WebModule.MessagePack.decode(WebModule.MessagePack.encode(-4294967298)) === -4294967298, // [0xd3, 0xff, 0xff, 0xff, 0xfe, 0xff, 0xff, 0xff, 0xfe] -4294967298(-0x100000002)
        "-549755813888":WebModule.MessagePack.decode(WebModule.MessagePack.encode(-549755813888)) === -549755813888, // [0xd3, 0xff, 0xff, 0xff, 0x80, 0x00, 0x00, 0x00, 0x00]
        "-0x1fffffffffffff": true, // IEEE754
        "-0x20000000000000": true, // IEEE754
        "-0x40000000000000": true, // IEEE754
    };
    var result = JSON.stringify(cases, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testMessagePack_String(test, pass, miss) {
    var source = [
        "",
        "Hello",
        "今日は海鮮丼が食べたいです",
        "焼き肉もいいですね。カルビx3, ハラミx2, ブタバラ, T-BORNx500g, ライス大盛りで",
    ];
    var cases = {
        "0": WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[0])) === source[0],
        "1": WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[1])) === source[1],
        "2": WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[2])) === source[2],
        "3": WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[3])) === source[3],
    };

    var result = JSON.stringify(cases, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testMessagePack_BooleanArray(test, pass, miss) {

    var source = [true, false];
    var packed = WebModule.MessagePack.encode(source);
    var result = WebModule.MessagePack.decode(packed);

    if (_likeArray(source, result)) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testMessagePack_Object(test, pass, miss) {
    var source = [
        {}, // [0x80]
        { a: 0, b: 0 },
        { a: [1, 2, 3.456, { b: -4.567, c: "hoge" }, "abc"] },
        { 'abc': [123] }, // [0x81, 0xa3, 0x61, 0x62, 0x63, 0x91, 0x7b]
        { abc: [123, 456], a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10, k: 11, l: 12, l: 13, m: 14, n: 15, o: 16, p: 17 },
                // [222, 0, 17, 163, 97, 98, 99, 146, 123, 205, 1, 200, 161, 97, 1, 161, 98, 2, 161, 99, 3, 161, 100, 4, 161, 101, 5, 161,
                //  102, 6, 161, 103, 7, 161, 104, 8, 161, 105, 9, 161, 106, 10, 161, 107, 11, 161, 108, 13, 161, 109, 14, 161, 110, 15, 161,
                //  111, 16, 161, 112, 17]
        // 5
        [], // [0x90]
        [123], // [0x91, 0x7b]
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 'hoge'],
                // [220, 0, 17, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 164, 104, 111, 103, 101]
        { a: ['b', 1, 0.123, { c: {}, d: null }, -1.11] },
                // [129, 161, 97, 149, 161, 98, 1, 203, 63, 191, 124, 237, 145, 104, 114, 176, 130, 161, 99, 128, 161, 100, 192, 203, 191,
                //  241, 194, 143, 92, 40, 245, 195]
    ];
    var cases = {
        "0": _likeObject(WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[0])), source[0]),
        "1": _likeObject(WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[1])), source[1]),
        "2": _likeObject(WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[2])), source[2]),
        "3": _likeObject(WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[3])), source[3]),
        "4": _likeObject(WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[4])), source[4]),
        "5": _likeObject(WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[5])), source[5]),
        "6": _likeObject(WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[6])), source[6]),
        "7": _likeObject(WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[7])), source[7]),
        "8": _likeObject(WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[8])), source[8]),
    };

    var result = JSON.stringify(cases, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testMessagePack_ObjectAndArray(test, pass, miss) {
    var source = { a: [1, 2, 3, { b: 4, c: "hoge" }, "abc"] };
    var packed = WebModule.MessagePack.encode(source);
    var result = WebModule.MessagePack.decode(packed);
    var compare = [
            129, 161, 97, 149, 1, 2, 3, 130,
            161, 98, 4, 161, 99, 164, 104,
            111, 103, 101, 163, 97, 98, 99
        ];

    if (_likeObject(source, result) && _likeArray(packed, compare)) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testMessagePack_InvalidTypes(test, pass, miss) {

    try {
        var source = new Date;
        var packed = WebModule.MessagePack.encode(source, { pack:   null });
        var result = WebModule.MessagePack.decode(packed, { unpack: null });

        test.done(miss());
    } catch (o_o) {
    }

    try {
        var source = function hoge() {};
        var packed = WebModule.MessagePack.encode(source);
        var result = WebModule.MessagePack.decode(packed);

    } catch (o_o) {
    }

    try {
        var source = /^aaa/;
        var packed = WebModule.MessagePack.encode(source);
        var result = WebModule.MessagePack.decode(packed);

        test.done(miss());
    } catch (o_o) {
    }

    test.done(pass());
}

function testMessagePack_NaNFloat(test, pass, miss) {
    var result = WebModule.MessagePack.decode(new Uint8Array([0xca, 0x7f, 0xbf, 0xff, 0xff]));

    if (isNaN(result)) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testMessagePack_NaNDouble(test, pass, miss) {
    var result = WebModule.MessagePack.decode(new Uint8Array([0xcb, 0xff, 0xf7, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]));

    if (isNaN(result)) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testMessagePack_InfinityFloat(test, pass, miss) {
    var result = WebModule.MessagePack.decode(new Uint8Array([0xca, 0xff, 0x80, 0x00, 0x00]));

    if (result === Infinity || result === -Infinity) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testMessagePack_InfinityDouble(test, pass, miss) {
    var result = WebModule.MessagePack.decode(new Uint8Array([0xcb, 0xff, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));

    if (result === Infinity || result === -Infinity) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testMessagePack_NaN(test, pass, miss) {
    var source = NaN;
    var packed = WebModule.MessagePack.encode(source);
    var result = WebModule.MessagePack.decode(packed);

    if (isNaN(result)) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testMessagePack_Infinity(test, pass, miss) {
    var source = Infinity;
    var packed = WebModule.MessagePack.encode(source);
    var result = WebModule.MessagePack.decode(packed);

    if (result === Infinity) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testMessagePack_CyclicReferenceError(test, pass, miss) {
    var ary = [];
    var cyclicReferenceObject = {
        ary: ary
    };
    ary[0] = cyclicReferenceObject;

    try {
        var packed = WebModule.MessagePack.encode(cyclicReferenceObject);

        test.done(miss());

    } catch (o_o) {
        if (o_o instanceof TypeError) {
            test.done(pass());
        }
    } finally {
        // --- GC ---
        ary = null;
        cyclicReferenceObject = null;
    }
}

function testMessagePack_Bin(test, pass, miss) {
    var array0xFF = [];
    for (var i = 0, iz = 0xFF + 1; i < iz; ++i) {
        array0xFF.push(i);
    }
    var array0xFFFF = [];
    for (var i = 0, iz = 0xFFFF + 1; i < iz; ++i) {
        array0xFFFF.push(i);
    }
    var array0x20FFFF = [];
    for (var i = 0, iz = 0x20FFFF + 1; i < iz; ++i) {
        array0x20FFFF.push(i);
    }

    var source = [
        new Uint8Array([]),
        new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]),
        new Uint8Array(array0xFF),
        new Uint8Array(array0xFFFF),
        new Uint8Array(array0x20FFFF),
    ];
    var cases = {
        "0": _likeArray(WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[0])), source[0]),
        "1": _likeArray(WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[1])), source[1]),
        "2": _likeArray(WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[2])), source[2]),
        "3": _likeArray(WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[3])), source[3]),
        "4": _likeArray(WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[4])), source[4]),
    };

    var result = JSON.stringify(cases, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testMessagePack_ExtDate(test, pass, miss) {
    var options = {};
    var source = [
            new Date(),
        ];
    var cases = {
            "0": _likeDate(WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[0], options), options), source[0]),
        };

    var result = JSON.stringify(cases, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
    function _likeDate(a, b) {
        if (a.getTime() === b.getTime()) {
            return true;
        }
        return false;
    }
}

function testMessagePack_ExtFoo(test, pass, miss) {
    function Foo(a,b,c) {
        this._a = a;
        this._b = b;
        this._c = c;
    }
    Foo.pack = function(source) { // @arg Any
                                  // @ret Uint8Array
        var result = new Uint8Array(3);
        result[0] = source._a;
        result[1] = source._b;
        result[2] = source._c;
        return result;
    };
    Foo.unpack = function(source) { // @arg Uint8Array
                                    // @ret Any
        var a = source[0];
        var b = source[1];
        var c = source[2];
        return new Foo(a, b, c);
    };
    Foo.prototype.toJSON = function() {
        return { a: this._a, b: this._b, c: this._c };
    };
    global.Foo = Foo;

    var options = {};
    var source = [
            new Foo(1,2,3)
        ];
    var cases = {
            "0": _likeObject(WebModule.MessagePack.decode(WebModule.MessagePack.encode(source[0], options), options), source[0]),
        };

    var result = JSON.stringify(cases, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}





/*
## JSON stringify and parse

| nodes | json-enc  | json-dec  |
|-------|-----------|-----------|
| 100   |   0.02    |   0.02    |
| 1000  |   0.23    |   0.18    |
| 10000 |   2.67    |   2.09    |

## MessagePack encode and decode

| nodes | msg-enc   | msg-dec   | msg-enc-a | msg-dec-a |
|-------|-----------|-----------|-----------|-----------|
| 100   |   0.70    |   1.45    |   0.07    |   0.26    |
| 1000  |   8.43    |  13.44    |   0.73    |   2.78    |
| 10000 |  17.59    |  80.91    |   1.98    |  19.78    |

 */

function testMessagePack_vs_JSON_BenchMark(test, pass, miss) {
    var random = new WebModule.Random();
    var options  = { askey: true, ascii: true,  buffer: new Uint8Array(1024 * 1024) }; // 1MB buffer
    var options2 = { askey: true, ascii: false, buffer: new Uint8Array(1024 * 1024) }; // 1MB buffer
    var options3 = { askey: true, ascii: true,  buffer: new Uint8Array(1024 * 1024) }; // 1MB buffer
    var nodes = 10000;
    var json_TYPE_MIX       = _TYPE_MIX(random, nodes);
    var json_TYPE_INT8      = _TYPE_INT8(random, nodes);
    var json_TYPE_INT16     = _TYPE_INT16(random, nodes);
    var json_TYPE_INT32     = _TYPE_INT32(random, nodes);
    var json_TYPE_INT64     = _TYPE_INT64(random, nodes);
    var json_TYPE_UINT8     = _TYPE_UINT8(random, nodes);
    var json_TYPE_UINT16    = _TYPE_UINT16(random, nodes);
    var json_TYPE_UINT32    = _TYPE_UINT32(random, nodes);
    var json_TYPE_UINT64    = _TYPE_UINT64(random, nodes);
    var json_TYPE_FLOAT64   = _TYPE_FLOAT64(random, nodes);
    var json_TYPE_FIX_UINT  = _TYPE_FIX_UINT(random, nodes);
    var json_TYPE_FIX_ARRAY = _TYPE_FIX_ARRAY(random, nodes);

    console.table( testMessagePack_vs_JSON_bench("TYPE_MIX",       json_TYPE_MIX, nodes, {}) );
    console.table( testMessagePack_vs_JSON_bench("TYPE_MIX(askey)",json_TYPE_MIX, nodes, options2) );
    console.table( testMessagePack_vs_JSON_bench("TYPE_MIX(askey,ascii)",json_TYPE_MIX, nodes, options3) );
    console.table( testMessagePack_vs_JSON_bench("TYPE_INT8",      json_TYPE_INT8, nodes, options) );
    console.table( testMessagePack_vs_JSON_bench("TYPE_INT16",     json_TYPE_INT16, nodes, options) );
    console.table( testMessagePack_vs_JSON_bench("TYPE_INT32",     json_TYPE_INT32, nodes, options) );
    console.table( testMessagePack_vs_JSON_bench("TYPE_INT64",     json_TYPE_INT64, nodes, options) );
    console.table( testMessagePack_vs_JSON_bench("TYPE_UINT8",     json_TYPE_UINT8, nodes, options) );
    console.table( testMessagePack_vs_JSON_bench("TYPE_UINT16",    json_TYPE_UINT16, nodes, options) );
    console.table( testMessagePack_vs_JSON_bench("TYPE_UINT32",    json_TYPE_UINT32, nodes, options) );
    console.table( testMessagePack_vs_JSON_bench("TYPE_UINT64",    json_TYPE_UINT64, nodes, options) );
    console.table( testMessagePack_vs_JSON_bench("TYPE_FLOAT64",   json_TYPE_FLOAT64, nodes, options) );
    console.table( testMessagePack_vs_JSON_bench("TYPE_FIX_UINT",  json_TYPE_FIX_UINT, nodes, options) );
    console.table( testMessagePack_vs_JSON_bench("TYPE_FIX_ARRAY", json_TYPE_FIX_ARRAY, nodes, options) );

    test.done(pass());
}

function testMessagePack_vs_JSON_bench(theme, json, nodes, options) {
    function now() {
        return global["performance"] ? performance.now() : Date.now();
    }
    function tryMessagePack(json, check, encodeScore, decodeScore, binaryLength) {
        var beginEncode = now();
        var enc         = WebModule.MessagePack.encode(json, options);
        var endEncode   = now();
        var dec         = WebModule.MessagePack.decode(enc, options);
        var endDecode   = now();

        if (check && !_likeObject(dec, json)) {
            console.log("unmatch1");
        }
        encodeScore.push(endEncode - beginEncode);
        decodeScore.push(endDecode - endEncode);
        binaryLength.push(enc.length);

    }
    function tryJSON(json, check, encodeScore, decodeScore, binaryLength) {
        var beginEncode = now();
        var enc         = JSON.stringify(json);
        var endEncode   = now();
        var dec         = JSON.parse(enc);
        var endDecode   = now();

        if (check && !_likeObject(dec, json)) {
            console.log("unmatch2");
        }
        encodeScore.push(endEncode - beginEncode);
        decodeScore.push(endDecode - endEncode);
        binaryLength.push(enc.length);
    }

    // --- collect score ---
    var times = 12;
    var scores1 = [], scores2 = [], scores3 = [], scores4 = [];
    var binaryLength1 = [], binaryLength2 = [];
    for (var i = 0; i < times; ++i) { tryJSON(json, true, scores1, scores2, binaryLength1); }
    for (var i = 0; i < times; ++i) { tryMessagePack(json, true, scores3, scores4, binaryLength2); }

    return {
        "JSON": {
            "nodes":        theme + " " + nodes,
            "encode":       parseFloat( getAverage(scores1, times).toFixed(2) ),
            "decode":       parseFloat( getAverage(scores2, times).toFixed(2) ),
            "binaryLength": parseFloat( getAverage(binaryLength1, times).toFixed(2) ),
        },
        "MessagePack": {
            "nodes":        theme + " " + nodes,
            "encode":       parseFloat( getAverage(scores3, times).toFixed(2) ),
            "decode":       parseFloat( getAverage(scores4, times).toFixed(2) ),
            "binaryLength": parseFloat( getAverage(binaryLength2, times).toFixed(2) ),
        }
    };

    function getAverage(scores, items) {
        var higher = 2;
        var lower = 2;
        var total = scores.sort(function(a, b) { return a - b; }).slice(higher, -lower).reduce(function(result, value) {
                        return result + value;
                    }, 0);

        return total / (items - higher - lower);
    }
}

function _TYPE_MIX(random, nodes) {
    function child(num) {
      //switch ( ((Math.random() * 9) | 0) % 9 ) {
        switch ( random.next() % 9 ) {
        case 0: return null;  break; // TYPE_NIL
        case 1: return false; break; // TYPE_FALSE
        case 2: return true;  break; // TYPE_TRUE
        case 3: return num.toString(16);
        //case 3: return num.toString(16) + String.fromCharCode(i & 0xffff, i & 0xffff, i & 0xffff, i & 0xffff); break;
        case 4: return num;   break; // TYPE_POS_FIXINT, TYPE_UINT16, TYPE_UINT32, TYPE_UINT64
        case 5: return -num;  break; // TYPE_NEG_FIXINT, TYPE_INT16, TYPE_INT32, TYPE_INT64
        case 6: return num / 123.456789; break;    // TYPE_FLOAT64
        case 7: return -(num / 123.456789); break; // TYPE_FLOAT64
        case 8: return [child(num), child(num + 1), child(num + 2)]; // TYPE_FIX_ARRAY
        }
        // TYPE_FIX_MAP
        var r = {};
        r[num] = child(num);
        return r;
    }

    var result = {};

    for (var i = 0; i < nodes; ++i) {
        result[i] = child(i);
    }
    return result;
}

function _TYPE_UINT8(random, nodes) {
    var result = [];
    for (var i = 0; i < nodes; ++i) { result[i] = 0x00 + (i % 0xff); }
    return result;
}
function _TYPE_UINT16(random, nodes) {
    var result = [];
    for (var i = 0; i < nodes; ++i) { result[i] = 0x100 + (i % 0xff); }
    return result;
}
function _TYPE_UINT32(random, nodes) {
    var result = [];
    for (var i = 0; i < nodes; ++i) { result[i] = 0x10000 + (i % 0xff); }
    return result;
}
function _TYPE_UINT64(random, nodes) {
    var result = [];
    for (var i = 0; i < nodes; ++i) { result[i] = 0x100000000 + (i % 0xff); }
    return result;
}
function _TYPE_INT8(random, nodes) {
    var result = [];
    for (var i = 0; i < nodes; ++i) { result[i] = -33 - (i % 50); }
    return result;
}
function _TYPE_INT16(random, nodes) {
    var result = [];
    for (var i = 0; i < nodes; ++i) { result[i] = -128 - (i % 50); }
    return result;
}
function _TYPE_INT32(random, nodes) {
    var result = [];
    for (var i = 0; i < nodes; ++i) { result[i] = -0x8001 - (i % 0xff); }
    return result;
}
function _TYPE_INT64(random, nodes) {
    var result = [];
    for (var i = 0; i < nodes; ++i) { result[i] = -0x80000001 - i; }
    return result;
}
function _TYPE_FLOAT64(random, nodes) {
    var result = [];

    for (var i = 0; i < nodes; ++i) {
        result[i] = 0.1234567890123 + i;
    }
    return result;
}
function _TYPE_FIX_ARRAY(random, nodes) {
    var result = [];

    for (var i = 0; i < nodes; ++i) {
        result.push( [] );
    }
    return result;
}
function _TYPE_FIX_UINT(random, nodes) {
    var result = [];

    for (var i = 0; i < nodes; ++i) {
        result.push( i % 128 ); // 0 - 127
    }
    return result;
}

function _likeArray(a,             // @arg TypedArray|Array
                    b,             // @arg TypedArray|Array
                    fixedDigits) { // @arg Integer = 0 - floatingNumber.toFixed(fixedDigits)
                                   // @ret Boolean
    fixedDigits = fixedDigits || 0;
    if (a.length !== b.length) {
        return false;
    }
    for (var i = 0, iz = a.length; i < iz; ++i) {
        if (fixedDigits) {
            if ( a[i].toFixed(fixedDigits) !== b[i].toFixed(fixedDigits) ) {
                return false;
            }
        } else {
            if ( a[i] !== b[i] ) {
                return false;
            }
        }
    }
    return true;
}

function _likeObject(a,   // @arg Object
                     b) { // @arg Object
    return JSON.stringify(a) === JSON.stringify(b);
}

return test.run();

})(GLOBAL);

