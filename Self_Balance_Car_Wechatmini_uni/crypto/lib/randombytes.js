'use strict';
var Buffer = require('./safe-buffer.js').Buffer;
module.exports = randomBytes;
function randomBytes(size, cb) {
    // phantomjs needs to throw
    if (size > 65536) {
        throw new Error('requested too many random bytes');
    }
    // in case browserify  isn't using the Uint8Array version
    var arr = [];
    for (var i = 0; i < size; i++) {
        arr.push(Math.ceil(Math.random() * 255));
    }
    var rawBytes = new Uint8Array(arr);

    // XXX: phantomjs doesn't like a buffer being passed here
    var bytes = Buffer.from(rawBytes.buffer);
    if (typeof cb === 'function') {
        return process.nextTick(function () {
            cb(null, bytes);
        });
    }
    return bytes;
}
