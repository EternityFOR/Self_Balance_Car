const FRAME_CTRL_POSITION_ENCRYPTED = 0;
const FRAME_CTRL_POSITION_CHECKSUM = 1;
const FRAME_CTRL_POSITION_DATA_DIRECTION = 2;
const FRAME_CTRL_POSITION_REQUIRE_ACK = 3;
const FRAME_CTRL_POSITION_FRAG = 4;
const DIRECTION_OUTPUT = 0;
const DIRECTION_INPUT = 1;
const AES_BASE_IV = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const NEG_SET_SEC_TOTAL_LEN = 0;
const NEG_SET_SEC_ALL_DATA = 1;
const PACKAGE_VALUE = 1;
const SUBTYPE_NEG = 0;
const SUBTYPE_WIFI_MODEl = 2;
const SUBTYPE_END = 3;
const PACKAGE_CONTROL_VALUE = 0;
const SUBTYPE_WIFI_NEG = 9;
const SUBTYPE_SET_SSID = 2;
const SUBTYPE_SET_PWD = 3;
const SUBTYPE_WIFI_LIST_NEG = 11;
const SUBTYPE_NEGOTIATION_NEG = 0;
const SUBTYPE_CUSTOM_DATA = 19;
var DH_P =
    'cf5cf5c38419a724957ff5dd323b9c45c3cdd261eb740f69aa94b8bb1a5c96409153bd76b24222d03274e4725a5406092e9e82e9135c643cae98132b0d95f7d65347c68afc1e677da90e51bbab5f5cf429c291b4ba39c6b2dc5e8c7231e46aa7728e87664532cdf547be20c9a3fa8342be6e34371a27c06f7dc0edddd2f86373';
var DH_G = '02';
const descSucList = [
    'Bluetooth connecting...',
    'Bluetooth connection successful',
    'Device information is successfully obtained',
    'Attribute information is successfully obtained',
    'Send configuration information...',
    'Configuration information sent successfully',
    'Connection successfully'
];
const descFailList = [
    'Bluetooth connection failed',
    'Device information acquisition failed',
    'Attribute information acquisition failed',
    'Configuration information sent failed',
    'Distribution network failed'
];
const successList = {
    0: 'NULL',
    1: 'STA',
    2: 'SoftAP',
    3: 'SoftAP & STA'
};
var CRC_TB = [
    0, 4129, 8258, 12387, 16516, 20645, 24774, 28903, 33032, 37161, 41290, 45419, 49548, 53677, 57806, 61935, 4657, 528, 12915, 8786, 21173, 17044, 29431, 25302, 37689, 33560,
    45947, 41818, 54205, 50076, 62463, 58334, 9314, 13379, 1056, 5121, 25830, 29895, 17572, 21637, 42346, 46411, 34088, 38153, 58862, 62927, 50604, 54669, 13907, 9842, 5649, 1584,
    30423, 26358, 22165, 18100, 46939, 42874, 38681, 34616, 63455, 59390, 55197, 51132, 18628, 22757, 26758, 30887, 2112, 6241, 10242, 14371, 51660, 55789, 59790, 63919, 35144,
    39273, 43274, 47403, 23285, 19156, 31415, 27286, 6769, 2640, 14899, 10770, 56317, 52188, 64447, 60318, 39801, 35672, 47931, 43802, 27814, 31879, 19684, 23749, 11298, 15363,
    3168, 7233, 60846, 64911, 52716, 56781, 44330, 48395, 36200, 40265, 32407, 28342, 24277, 20212, 15891, 11826, 7761, 3696, 65439, 61374, 57309, 53244, 48923, 44858, 40793,
    36728, 37256, 33193, 45514, 41451, 53516, 49453, 61774, 57711, 4224, 161, 12482, 8419, 20484, 16421, 28742, 24679, 33721, 37784, 41979, 46042, 49981, 54044, 58239, 62302, 689,
    4752, 8947, 13010, 16949, 21012, 25207, 29270, 46570, 42443, 38312, 34185, 62830, 58703, 54572, 50445, 13538, 9411, 5280, 1153, 29798, 25671, 21540, 17413, 42971, 47098, 34713,
    38840, 59231, 63358, 50973, 55100, 9939, 14066, 1681, 5808, 26199, 30326, 17941, 22068, 55628, 51565, 63758, 59695, 39368, 35305, 47498, 43435, 22596, 18533, 30726, 26663,
    6336, 2273, 14466, 10403, 52093, 56156, 60223, 64286, 35833, 39896, 43963, 48026, 19061, 23124, 27191, 31254, 2801, 6864, 10931, 14994, 64814, 60687, 56684, 52557, 48554,
    44427, 40424, 36297, 31782, 27655, 23652, 19525, 15522, 11395, 7392, 3265, 61215, 65342, 53085, 57212, 44955, 49082, 36825, 40952, 28183, 32310, 20053, 24180, 11923, 16050,
    3793, 7920
];
const formatTime = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};
const formatNumber = (n) => {
    n = n.toString();
    return n[1] ? n : '0' + n;
};
const showToast = (title) => {
    uni.showToast({
        title: title,
        icon: 'none',
        duration: 2000
    });
};
//转16进制
const ab2hex = (buffer) => {
    var hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
        return ('00' + bit.toString(16)).slice(-2);
    });
    return hexArr;
};
//16进制转字符串
const hexCharCodeToStr = (hexCharCodeStr) => {
    var trimedStr = hexCharCodeStr.trim();
    var rawStr = trimedStr.substr(0, 2).toLowerCase() === '0x' ? trimedStr.substr(2) : trimedStr;
    var len = rawStr.length;
    if (len % 2 !== 0) {
        alert('Illegal Format ASCII Code!');
        return '';
    }
    var curCharCode;
    var resultStr = [];
    for (var i = 0; i < len; i = i + 2) {
        curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
        resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr.join('');
};
//过滤名称
const filterDevice = (devices, name) => {
    var list = [];
    for (var i = 0; i < devices.length; i++) {
        var device = devices[i];
        if (device[name] && device[name].indexOf('BLUFI_DEVICE') !== -1) {
            list.push(device);
        }
    }
    return list;
};
//获去type
const getType = (pkgType, subType) => {
    return (subType << 2) | pkgType;
};
//unit8Arry转数组
const uint8ArrayToArray = (uint8Array) => {
    var array = [];
    for (var i = 0; i < uint8Array.byteLength; i++) {
        array[i] = uint8Array[i];
    }
    return array;
};
//16进制转二进制数组
const hexToBinArray = (str) => {
    var dec = parseInt(str, 16);
    var bin = dec.toString(2);
    var len = bin.length;
    if (len < 8) {
        var diff = 8 - len;
        var zeros = '';
        for (var i = 0; i < diff; i++) {
            zeros += '0';
        }
        bin = zeros + bin;
    }
    return bin.split('');
};
//16进制转数组
const hexByArray = (str) => {
    var arr = [];
    if (str.length % 2 != 0) {
        str = '0' + str;
    }
    for (var i = 0; i < str.length; i += 2) {
        arr.push(str.substring(i, i + 2));
    }
    return arr;
};
//16进制转整形数组
const hexByInt = (str) => {
    var arr = [];
    if (str.length % 2 != 0) {
        str = '0' + str;
    }
    for (var i = 0; i < str.length; i += 2) {
        arr.push(parseInt(str.substring(i, i + 2), 16));
    }
    return arr;
};
//排序
const sortBy = (attr, rev) => {
    //第二个参数没有传递 默认升序排列
    if (rev == undefined) {
        rev = 1;
    } else {
        rev = rev ? 1 : -1;
    }
    return function (a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
            return rev * -1;
        } else if (a > b) {
            return rev * 1;
        }
        return 0;
    };
};
//判断非空
const _isEmpty = (str) => {
    if (str === '' || str === null || str === undefined || str === 'null' || str === 'undefined') {
        return true;
    } else {
        return false;
    }
};
//组装数据格式
const writeData = (type, subType, frameCtl, seq, len, data) => {
    var self = this;
    var value = [];
    var type = getType(type, subType);
    value.push(type);
    value.push(frameCtl);
    value.push(seq);
    value.push(len);
    if (!_isEmpty(data)) {
        value = value.concat(data);
    }
    return value;
};
//是否分包
const isSubcontractor = (data, checksum, sequence, encrypt) => {
    var len = 0;
    var lenData = [];
    var laveData = [];
    var flag = false;
    var total = data.length;
    if (total > 16) {
        if (checksum) {
            lenData = data.slice(0, 12);
            laveData = data.slice(12);
        } else {
            lenData = data.slice(0, 14);
            laveData = data.slice(14);
        }
        var len1 = (total >> 8) & 255;
        var len2 = total & 255;
        lenData.splice(0, 0, len1);
        lenData.splice(0, 0, len2);
        len = lenData.length;
        flag = true;
    } else {
        lenData = data;
        len = lenData.length;
    }
    if (checksum) {
        lenData = assemblyChecksum(lenData, len, sequence);
    }
    return {
        len: len,
        lenData: lenData,
        laveData: laveData,
        flag: flag
    };
};
const assemblyChecksum = (list, len, sequence, encrypt) => {
    var checkData = [];
    checkData.push(sequence);
    checkData.push(len);
    checkData = checkData.concat(list);
    var crc = caluCRC(0, checkData);
    var checksumByte1 = crc & 255;
    var checksumByte2 = (crc >> 8) & 255;
    list.push(checksumByte1);
    list.push(checksumByte2);
    return list;
};
//加密发送的数据
const encrypt = (aesjs, md5Key, sequence, data, checksum) => {
    var iv = generateAESIV(sequence);
    var sumArr = [];
    var list = [];
    if (checksum) {
        var len = data.length - 2;
        list = data.slice(0, len);
        sumArr = data.slice(len);
    } else {
        list = data;
    }
    var encryptData = uint8ArrayToArray(blueAesEncrypt(aesjs, md5Key, iv, new Uint8Array(list)));
    return encryptData.concat(sumArr);
};
//判断返回的数据是否加密
const isEncrypt = (self, fragNum, list, md5Key) => {
    var checksum = [];
    var checkData = [];
    if (fragNum[7] == '1') {
        //返回数据加密
        if (fragNum[6] == '1') {
            var len = list.length - 2;
            // checkData = list.slice(2, len);
            // checksum = list.slice(len);
            // console.log(checksum);
            // var crc = caluCRC(0, checkData);
            // var checksumByte1 = crc & 0xff;
            // var checksumByte2 = (crc >> 8) & 0xff;
            list = list.slice(0, len);
        }
        var iv = this.generateAESIV(parseInt(list[2], 16));
        if (fragNum[3] == '0') {
            //未分包
            list = list.slice(4);
            self.setData({
                flagEnd: true
            });
        } else {
            //分包
            list = list.slice(6);
        }
        list = uint8ArrayToArray(this.blueAesDecrypt(aesjs, md5Key, iv, new Uint8Array(list)));
    } else {
        //返回数据未加密
        if (fragNum[6] == '1') {
            var len = list.length - 2;
            // checkData = list.slice(2, len);
            // checksum = list.slice(len);
            // var crc = caluCRC(0, checkData);
            // var checksumByte1 = crc & 0xff;
            // var checksumByte2 = (crc >> 8) & 0xff;
            list = list.slice(0, len);
        }
        if (fragNum[3] == '0') {
            //未分包
            list = list.slice(4);
            self.setData({
                flagEnd: true
            });
        } else {
            //分包
            list = list.slice(6);
        }
    }
    return list;
};
//DH加密
const blueDH = (p, g, crypto) => {
    var client = crypto.createDiffieHellman(p, 'hex', g, 'hex');
    var clientKey = client.generateKeys();
    //var clientSecret = client.computeSecret(server.getPublicKey());
    return client;
};
//md5加密
const blueMd5 = (md5, key) => {
    var arr = md5.array(key);
    return arr;
};
// aes加密
const blueAesEncrypt = (aesjs, mdKey, iv, bytes) => {
    var aesOfb = new aesjs.ModeOfOperation.ofb(mdKey, iv);
    var encryptedBytes = aesOfb.encrypt(bytes);
    return encryptedBytes;
};
//aes解密
const blueAesDecrypt = (aesjs, mdKey, iv, bytes) => {
    var aesOfb = new aesjs.ModeOfOperation.ofb(mdKey, iv);
    var decryptedBytes = aesOfb.decrypt(bytes);
    return decryptedBytes;
};
//获取Frame Control
const getFrameCTRLValue = (encrypted, checksum, direction, requireAck, frag) => {
    var frame = 0;
    if (encrypted) {
        frame = frame | (1 << FRAME_CTRL_POSITION_ENCRYPTED);
    }
    if (checksum) {
        frame = frame | (1 << FRAME_CTRL_POSITION_CHECKSUM);
    }
    if (direction == DIRECTION_INPUT) {
        frame = frame | (1 << FRAME_CTRL_POSITION_DATA_DIRECTION);
    }
    if (requireAck) {
        frame = frame | (1 << FRAME_CTRL_POSITION_REQUIRE_ACK);
    }
    if (frag) {
        frame = frame | (1 << FRAME_CTRL_POSITION_FRAG);
    }
    return frame;
};
//获取aes iv
const generateAESIV = (sequence) => {
    var result = [];
    for (var i = 0; i < 16; i++) {
        if (i == 0) {
            result[0] = sequence;
        } else {
            result[i] = AES_BASE_IV[i];
        }
    }
    return result;
};
//计算CRC值
const caluCRC = (crc, pByte) => {
    crc = ~crc & 65535;
    for (var i in pByte) {
        crc = CRC_TB[((crc & 65535) >> 8) ^ (pByte[i] & 255)] ^ ((crc & 65535) << 8);
    }
    return ~crc & 65535;
};
const hsvToRgb = (h, s, v) => {
    var r;
    var g;
    var b;
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        case 5:
            r = v;
            g = p;
            b = q;
            break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};
const rgbToHsv = (r, g, b) => {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h;
    var s;
    var v = max;
    var d = max - min;
    s = max == 0 ? 0 : d / max;
    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return Math.round(h * 360);
};
const createCanvas = (self) => {
    var context = uni.createCanvasContext('firstCanvas', self);
    var width = Math.floor(self.data.width * 0.7);
    var height = width;
    var cx = width / 2;
    var cy = height / 2;
    var radius = width / 2.3;
    var imageData;
    var pixels;
    var hue;
    var sat;
    var value;
    var i = 0;
    var x;
    var y;
    var rx;
    var ry;
    var d;
    var f;
    var g;
    var p;
    var u;
    var v;
    var w;
    var rgb;
    uni.canvasGetImageData({
        canvasId: 'firstCanvas',
        x: 0,
        y: 0,
        width: width,
        height: height,
        success(res) {
            var pixels = res.data;
            for (y = 0; y < height; y++) {
                for (x = 0; x < width; x++, i = i + 4) {
                    rx = x - cx;
                    ry = y - cy;
                    d = rx * rx + ry * ry;
                    if (d < radius * radius) {
                        hue = (6 * (Math.atan2(ry, rx) + Math.PI)) / (2 * Math.PI);
                        sat = Math.sqrt(d) / radius;
                        g = Math.floor(hue);
                        f = hue - g;
                        u = 255 * (1 - sat);
                        v = 255 * (1 - sat * f);
                        w = 255 * (1 - sat * (1 - f));
                        pixels[i] = [255, v, u, u, w, 255, 255][g];
                        pixels[i + 1] = [w, 255, 255, v, u, u, w][g];
                        pixels[i + 2] = [u, u, w, 255, 255, v, u][g];
                        pixels[i + 3] = 255;
                    }
                }
            }
            uni.canvasPutImageData(
                {
                    canvasId: 'firstCanvas',
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    data: pixels,
                    success(res) {
                        setTimeout(function () {
                            context.beginPath();
                            context.arc(cx, cy, radius * 0.6, 0, 2 * Math.PI);
                            context.fillStyle = '#12151e';
                            context.fill();
                            context.stroke();
                            context.draw(true);
                            context.beginPath();
                            context.arc(cx, cy, radius, 0, 2 * Math.PI);
                            context.strokeStyle = '#12151e';
                            context.lineWidth = 5;
                            context.stroke();
                            context.draw(true);
                        });
                    },
                    fail(res) {}
                },
                self
            );
        }
    });
};
const getColor = (self, event) => {
    console.log(event);
    var x = event.touches[0].x;
    var y = event.touches[0].y;
    uni.canvasGetImageData({
        canvasId: 'firstCanvas',
        x: x,
        y: y,
        width: 1,
        height: 1,
        success(res) {
            var r = res.data[0];
            var g = res.data[1];
            var b = res.data[2];
            console.log(r, g, b);
            // 特殊值过滤
            if ((r == 0 && g == 0 && b == 0) || (r == 18 && g == 21 && b == 30)) {
                return false;
            } else {
                self.setData({
                    color: 'rgba(' + r + ', ' + g + ', ' + b + ', ' + self.data.currentLuminanceText / 100 + ')',
                    currentSaturationText: 100,
                    currentSaturation: 100,
                    currentHue: rgbToHsv(r, g, b)
                });
                self.setDeviceStatus();
            }
        }
    });
};
module.exports = {
    formatTime: formatTime,
    showToast: showToast,
    ab2hex: ab2hex,
    hexCharCodeToStr: hexCharCodeToStr,
    filterDevice: filterDevice,
    getType: getType,
    hexToBinArray: hexToBinArray,
    hexByArray: hexByArray,
    hexByInt: hexByInt,
    sortBy: sortBy,
    writeData: writeData,
    isSubcontractor: isSubcontractor,
    getFrameCTRLValue: getFrameCTRLValue,
    blueDH: blueDH,
    blueMd5: blueMd5,
    blueAesEncrypt: blueAesEncrypt,
    blueAesDecrypt: blueAesDecrypt,
    uint8ArrayToArray: uint8ArrayToArray,
    generateAESIV: generateAESIV,
    isEncrypt: isEncrypt,
    caluCRC: caluCRC,
    encrypt: encrypt,
    DH_P: DH_P,
    DH_G: DH_G,
    DIRECTION_OUTPUT: DIRECTION_OUTPUT,
    DIRECTION_INPUT: DIRECTION_INPUT,
    NEG_SET_SEC_TOTAL_LEN: NEG_SET_SEC_TOTAL_LEN,
    NEG_SET_SEC_ALL_DATA: NEG_SET_SEC_ALL_DATA,
    PACKAGE_VALUE: PACKAGE_VALUE,
    SUBTYPE_NEG: SUBTYPE_NEG,
    PACKAGE_CONTROL_VALUE: PACKAGE_CONTROL_VALUE,
    SUBTYPE_WIFI_NEG: SUBTYPE_WIFI_NEG,
    SUBTYPE_WIFI_LIST_NEG: SUBTYPE_WIFI_LIST_NEG,
    SUBTYPE_NEGOTIATION_NEG: SUBTYPE_NEGOTIATION_NEG,
    SUBTYPE_WIFI_MODEl: SUBTYPE_WIFI_MODEl,
    SUBTYPE_SET_SSID: SUBTYPE_SET_SSID,
    SUBTYPE_SET_PWD: SUBTYPE_SET_PWD,
    SUBTYPE_END: SUBTYPE_END,
    SUBTYPE_CUSTOM_DATA: SUBTYPE_CUSTOM_DATA,
    hsvToRgb: hsvToRgb,
    rgbToHsv: rgbToHsv,
    createCanvas: createCanvas,
    getColor: getColor,
    descSucList: descSucList,
    descFailList: descFailList,
    successList: successList,
    _isEmpty: _isEmpty
};
