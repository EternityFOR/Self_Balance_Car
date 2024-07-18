<template>
    <view class="container">
        <block v-if="!failure">
            <view class="schedule">
                <view class="schedule-result schedule-success">
                    <image class="schedule-img" mode="aspectFit" src="/static/images/round.gif"></image>
                    <view class="desc-wrapper">
                        <view class="text-value">
                            <text>{{ value }}</text>
                            <text class="text-samll">%</text>
                        </view>
                        <view class="text-desc">{{ desc }}</view>
                    </view>
                </view>
            </view>
        </block>
        <block v-else>
            <view class="schedule fail">
                <view class="schedule-result schedule-fail">
                    <image class="schedule-img" mode="aspectFit" src="/static/images/failure.png"></image>
                    <view class="desc-wrapper">
                        <view class="text-sigh"><text>!</text></view>
                        <view class="text-desc">Distribution network failed</view>
                    </view>
                </view>
            </view>
        </block>
        <view class="process-wrapper">
            <text class="text-process" v-for="(item, index) in processList" :key="index">{{ item }}</text>
            <text>{{ vConsoleV }}</text>
        </view>
    </view>
</template>

<script>
// pages/esptouchv2/provision.js
const util = require('../../../../utils/util.js');
const aesjs = require('../../../../crypto/aes.js');
const crypto = require('../../../../crypto/crypto-dh.js');
const md5 = require('../../../../crypto/md5.min.js');
const timeOut = 20; //超时时间
var timeId = '';
var sequenceControl = 0;
var sequenceNumber = -1;
var client = '';
export default {
    data() {
        return {
            failure: false,
            value: 0,
            desc: 'Device connecting...',
            blueConnectNum: 0,
            isChecksum: true,
            isEncrypt: true,
            flagEnd: false,
            defaultData: 1,
            ssidType: 2,
            passwordType: 3,
            meshIdType: 3,
            deviceId: '',
            ssid: '',
            uuid: '',
            serviceId: '',
            password: '',
            meshId: '',
            processList: [],
            result: [],
            vConsoleV: ''
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options){
		var that = this;
        const eventChannel = this.getOpenerEventChannel();
		let orderInfo = {};
		eventChannel.on('dataFromPrepare', function (data) {
			orderInfo.ssid = data.ssid;
			orderInfo.bssid = data.bssid;
			orderInfo.password = data.password;
			orderInfo.deviceId = data.deviceId;
			console.log(orderInfo);
			console.log(orderInfo.deviceId);
			that.setData({
			  ssid: orderInfo.ssid,
			  meshId: orderInfo.bssid,
			  password: orderInfo.password,
			  deviceId: orderInfo.deviceId
			});
			that.setSucBg();
			that.blueConnect();
		});
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        console.log('dadsa');
        this.closeConnect();
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
    methods: {
        backHome: function () {
            uni.reLaunch({
                url: '/pages/Index/home/home'
            });
        },
    
        blueConnect: function (event) {
            var that = this;
            sequenceControl = 0;
            sequenceNumber = -1;
            that.setData({
                flagEnd: false,
                serviceId: '',
                uuid: ''
            });
            that.setProcess(0, util.descSucList[0]);
            const maxRetries = 3;
            let attempt = 0;
            const tryConnect = () => {
                if (attempt >= maxRetries) {
                    uni.hideLoading();
                    uni.showToast({ title: 'Connection failed', icon: 'none', duration: 2000 });
                    console.error('Failed to connect after', maxRetries, 'attempts');
                    that.setFailProcess(true, util.descFailList[0]);
                    return;
                }
                attempt++;
                console.log(`Attempt ${attempt} to connect to device ${that.deviceId}`);
                uni.createBLEConnection({
                    deviceId: that.deviceId,
                    timeout: 10000,
                    success: () => {
                        setTimeout(()=>{
                            uni.setBLEMTU({  
                            deviceId:that.deviceId,  
                            mtu:128,  
                            success: () => {
                                that.getDeviceServices(that.deviceId);
                            },  
                            fail(err) {  
                                console.log('SetMTU Failed', err)  
                            }  
                            })  
                        },1000)
                    },
                    fail: function (res) {
                        console.log(res);
                        if(res.errCode = -1)
                        {
                            that.getDeviceServices(that.deviceId);
                        }
                    }
                });
            };
            tryConnect();
        },
        
        getDeviceServices: function (deviceId) {
            var that = this;
            const targetServiceId = getApp().globalData.data.service_uuid_blufi;
            uni.getBLEDeviceServices({
                deviceId: deviceId,
                success: function (serviceRes) {
                    let matchedService = serviceRes.services.find(service => service.uuid === targetServiceId);
                    if (matchedService) {
                        that.setProcess(10, util.descSucList[1]);
                        that.getDeviceCharacteristics(deviceId, matchedService.uuid);
                        return false;
                    }
                },
                fail: function (serviceRes) {
                    console.log(serviceRes);
                    that.setFailProcess(true, util.descFailList[1]);
                }
            });
        },
    
        getDeviceCharacteristics: function (deviceId, serviceId) {
            var that = this;
            uni.getBLEDeviceCharacteristics({
                deviceId: deviceId,
                serviceId: serviceId,
                success: function (res) {
                    that.setProcess(20, util.descSucList[2]);
                    var list = res.characteristics;
                    if (list.length > 0) {
                        for (var i = 0; i < list.length; i++) {
                            var uuid = list[i].uuid;
                            console.log(uuid);
                            if (uuid == getApp().globalData.data.characteristic_write_uuid_blufi) {
                                that.openNotify(deviceId, serviceId, uuid);
                                that.setData({
                                    serviceId: serviceId,
                                    uuid: uuid
                                });
                                return false;
                            }
                        }
                    }
                },
                fail: function (res) {
                    console.log(res);
                    that.setFailProcess(true, util.descFailList[2]);
                }
            });
        },
    
        notifyDevice: function (deviceId, serviceId, characteristicId) {
            var that = this;
            client = util.blueDH(util.DH_P, util.DH_G, crypto);
            var kBytes = util.uint8ArrayToArray(client.getPublicKey());
            var pBytes = util.hexByInt(util.DH_P);
            var gBytes = util.hexByInt(util.DH_G);
            var pgkLength = pBytes.length + gBytes.length + kBytes.length + 6;
            var pgkLen1 = (pgkLength >> 8) & 255;
            var pgkLen2 = pgkLength & 255;
            var data = [];
            data.push(util.NEG_SET_SEC_TOTAL_LEN);
            data.push(pgkLen1);
            data.push(pgkLen2);
            var frameControl = util.getFrameCTRLValue(false, false, util.DIRECTION_OUTPUT, false, false);
            var value = util.writeData(util.PACKAGE_VALUE, util.SUBTYPE_NEG, frameControl, sequenceControl, data.length, data);
            var typedArray = new Uint8Array(value);
            setTimeout(() => {
                uni.writeBLECharacteristicValue({
                    deviceId: deviceId,
                    serviceId: serviceId,
                    characteristicId: characteristicId,
                    value: typedArray.buffer,
                    success: function (res) {
                        that.getSecret(deviceId, serviceId, characteristicId, client, kBytes, pBytes, gBytes, null);
                    },
                    fail: function (res) {
                        console.log(res);
                        that.setFailProcess(true, util.descFailList[2]);
                    }
                });
            }, 1000); // Delay before writing characteristic value
        },
    
        getSecret: function (deviceId, serviceId, characteristicId, client, kBytes, pBytes, gBytes, data) {
            var that = this;
            var obj = [];
            var frameControl = 0;
            sequenceControl = parseInt(sequenceControl) + 1;
            if (!util._isEmpty(data)) {
                obj = util.isSubcontractor(data, true, sequenceControl);
                frameControl = util.getFrameCTRLValue(false, true, util.DIRECTION_OUTPUT, false, obj.flag);
            } else {
                data = [];
                data.push(util.NEG_SET_SEC_ALL_DATA);
                var pLength = pBytes.length;
                var pLen1 = (pLength >> 8) & 255;
                var pLen2 = pLength & 255;
                data.push(pLen1);
                data.push(pLen2);
                data = data.concat(pBytes);
                var gLength = gBytes.length;
                var gLen1 = (gLength >> 8) & 255;
                var gLen2 = gLength & 255;
                data.push(gLen1);
                data.push(gLen2);
                data = data.concat(gBytes);
                var kLength = kBytes.length;
                var kLen1 = (kLength >> 8) & 255;
                var kLen2 = kLength & 255;
                data.push(kLen1);
                data.push(kLen2);
                data = data.concat(kBytes);
                obj = util.isSubcontractor(data, true, sequenceControl);
                frameControl = util.getFrameCTRLValue(false, true, util.DIRECTION_OUTPUT, false, obj.flag);
            }
            var value = util.writeData(util.PACKAGE_VALUE, util.SUBTYPE_NEG, frameControl, sequenceControl, obj.len, obj.lenData);
            var typedArray = new Uint8Array(value);
            setTimeout(() => {
                uni.writeBLECharacteristicValue({
                    deviceId: deviceId,
                    serviceId: serviceId,
                    characteristicId: characteristicId,
                    value: typedArray.buffer,
                    success: function (res) {
                        if (obj.flag) {
                            that.getSecret(deviceId, serviceId, characteristicId, client, kBytes, pBytes, gBytes, obj.laveData);
                        } else {
                            setTimeout(function () {
                                that.writeDeviceStart(deviceId, serviceId, characteristicId);
                            }, 3000);
                        }
                    },
                    fail: function (res) {
                        console.log(res);
                        console.log(deviceId);
                        console.log(serviceId);
                        console.log(characteristicId);
                        that.setFailProcess(true, util.descFailList[2]);
                    }
                });
            }, 1000); // Delay before writing characteristic value
        },
    
        writeDeviceStart: function (deviceId, serviceId, characteristicId, data) {
            var that = this;
            var obj = {};
            var frameControl = 0;
            that.setProcess(40, util.descSucList[4]);
            sequenceControl = parseInt(sequenceControl) + 1;
            if (!util._isEmpty(data)) {
                obj = util.isSubcontractor(data, that.isChecksum, sequenceControl, that.isEncrypt);
                frameControl = util.getFrameCTRLValue(that.isEncrypt, that.isChecksum, util.DIRECTION_OUTPUT, false, obj.flag);
            } else {
                obj = util.isSubcontractor([that.defaultData], that.isChecksum, sequenceControl, true);
                frameControl = util.getFrameCTRLValue(that.isEncrypt, that.isChecksum, util.DIRECTION_OUTPUT, false, obj.flag);
            }
            var defaultData = util.encrypt(aesjs, getApp().globalData.data.md5Key, sequenceControl, obj.lenData, true);
            var value = util.writeData(util.PACKAGE_CONTROL_VALUE, util.SUBTYPE_WIFI_MODEl, frameControl, sequenceControl, obj.len, defaultData);
            var typedArray = new Uint8Array(value);
            setTimeout(() => {
                uni.writeBLECharacteristicValue({
                    deviceId: deviceId,
                    serviceId: serviceId,
                    characteristicId: characteristicId,
                    value: typedArray.buffer,
                    success: function (res) {
                        if (obj.flag) {
                            that.writeDeviceStart(deviceId, serviceId, characteristicId, obj.laveData);
                        } else {
                            that.setProcess(60, util.descSucList[5]);
                            that.writeRouterSsid(deviceId, serviceId, characteristicId, null);
                        }
                    },
                    fail: function (res) {
                        console.log(res);
                        that.setFailProcess(true, util.descFailList[3]);
                    }
                });
            }, 1000); // Delay before writing characteristic value
        },
    
        writeRouterSsid: function (deviceId, serviceId, characteristicId, data) {
            var that = this;
            var obj = {};
            var frameControl = 0;
            sequenceControl = parseInt(sequenceControl) + 1;
            if (!util._isEmpty(data)) {
                obj = util.isSubcontractor(data, that.isChecksum, sequenceControl, that.isEncrypt);
                frameControl = util.getFrameCTRLValue(that.isEncrypt, that.isChecksum, util.DIRECTION_OUTPUT, false, obj.flag);
            } else {
                var ssidData = that.getCharCodeat(that.ssid);
                obj = util.isSubcontractor(ssidData, that.isChecksum, sequenceControl, that.isEncrypt);
                frameControl = util.getFrameCTRLValue(that.isEncrypt, that.isChecksum, util.DIRECTION_OUTPUT, false, obj.flag);
            }
            var defaultData = util.encrypt(aesjs, getApp().globalData.data.md5Key, sequenceControl, obj.lenData, true);
            var value = util.writeData(util.PACKAGE_VALUE, util.SUBTYPE_SET_SSID, frameControl, sequenceControl, obj.len, defaultData);
            var typedArray = new Uint8Array(value);
            setTimeout(() => {
                uni.writeBLECharacteristicValue({
                    deviceId: deviceId,
                    serviceId: serviceId,
                    characteristicId: characteristicId,
                    value: typedArray.buffer,
                    success: function (res) {
                        if (obj.flag) {
                            that.writeRouterSsid(deviceId, serviceId, characteristicId, obj.laveData);
                        } else {
                            that.writeDevicePwd(deviceId, serviceId, characteristicId, null);
                        }
                    },
                    fail: function (res) {
                        console.log(res);
                        that.setFailProcess(true, util.descFailList[4]);
                    }
                });
            }, 1000); // Delay before writing characteristic value
        },
    
        writeDevicePwd: function (deviceId, serviceId, characteristicId, data) {
            var that = this;
            var obj = {};
            var frameControl = 0;
            sequenceControl = parseInt(sequenceControl) + 1;
            if (!util._isEmpty(data)) {
                obj = util.isSubcontractor(data, that.isChecksum, sequenceControl, that.isEncrypt);
                frameControl = util.getFrameCTRLValue(that.isEncrypt, that.isChecksum, util.DIRECTION_OUTPUT, false, obj.flag);
            } else {
                var pwdData = that.getCharCodeat(that.password);
                obj = util.isSubcontractor(pwdData, that.isChecksum, sequenceControl, that.isEncrypt);
                frameControl = util.getFrameCTRLValue(that.isEncrypt, that.isChecksum, util.DIRECTION_OUTPUT, false, obj.flag);
            }
            var defaultData = util.encrypt(aesjs, getApp().globalData.data.md5Key, sequenceControl, obj.lenData, true);
            var value = util.writeData(util.PACKAGE_VALUE, util.SUBTYPE_SET_PWD, frameControl, sequenceControl, obj.len, defaultData);
            var typedArray = new Uint8Array(value);
            setTimeout(() => {
                uni.writeBLECharacteristicValue({
                    deviceId: deviceId,
                    serviceId: serviceId,
                    characteristicId: characteristicId,
                    value: typedArray.buffer,
                    success: function (res) {
                        if (obj.flag) {
                            that.writeDevicePwd(deviceId, serviceId, characteristicId, obj.laveData);
                        } else {
                            that.writeDeviceEnd(deviceId, serviceId, characteristicId);
                        }
                    },
                    fail: function (res) {
                        console.log(res);
                        that.setFailProcess(true, util.descFailList[4]);
                    }
                });
            }, 1000); // Delay before writing characteristic value
        },
    
        writeDeviceEnd: function (deviceId, serviceId, characteristicId) {
            var that = this;
            sequenceControl = parseInt(sequenceControl) + 1;
            var frameControl = util.getFrameCTRLValue(that.isEncrypt, false, util.DIRECTION_OUTPUT, false, false);
            var value = util.writeData(that.PACKAGE_CONTROL_VALUE, util.SUBTYPE_END, frameControl, sequenceControl, 0, null);
            var typedArray = new Uint8Array(value);
            setTimeout(() => {
                uni.writeBLECharacteristicValue({
                    deviceId: deviceId,
                    serviceId: serviceId,
                    characteristicId: characteristicId,
                    value: typedArray.buffer,
                    success: function (res) {
                        that.onTimeout(0);
                    },
                    fail: function (res) {
                        console.log(res);
                        that.setFailProcess(true, util.descFailList[4]);
                    }
                });
            }, 1000); // Delay before writing characteristic value
        },
    
        onTimeout: function (num) {
            const that = this;
            timeId = setInterval(function () {
                if (num < timeOut) {
                    num++;
                } else {
                    clearInterval(timeId);
                    that.setFailProcess(true, util.descFailList[4]);
                }
            }, 1000);
        },
    
        onNotify: function () {
            var that = this;
            uni.onBLECharacteristicValueChange(function (res) {
                that.getResultType(util.ab2hex(res.value));
            });
        },
    
        openNotify: function (deviceId, serviceId, characteristicId) {
            var that = this;
            uni.notifyBLECharacteristicValueChange({
                state: true,
                deviceId: deviceId,
                serviceId: serviceId,
                characteristicId: getApp().globalData.data.characteristic_read_uuid_blufi,
                success: function (res) {
                    that.notifyDevice(deviceId, serviceId, characteristicId);
                    that.onNotify();
                },
                fail: function (res) {
                    console.log(res);
                }
            });
        },
    
        getSsids: function (str) {
            var list = [];
            var strs = str.split(':');
            for (var i = 0; i < strs.length; i++) {
                list.push(parseInt(strs[i], 16));
            }
            return list;
        },
    
        getCharCodeat: function (str) {
            var list = [];
            for (var i = 0; i < str.length; i++) {
                list.push(str.charCodeAt(i));
            }
            return list;
        },
    
        getResultType: function (list) {
            var that = this;
            var result = that.result;
            if (list.length < 4) {
                that.setFailProcess(true, util.descFailList[4]);
                return false;
            }
            var val = parseInt(list[0], 16);
            var type = val & 3;
            var subType = val >> 2;
            var dataLength = parseInt(list[3], 16);
            if (dataLength == 0) {
                that.setFailProcess(true, util.descFailList[4]);
                return false;
            }
            if (type != parseInt(util.PACKAGE_VALUE)) {
                that.setFailProcess(true, util.descFailList[4]);
                return false;
            }
            var sequenceNum = parseInt(list[2], 16);
            if (sequenceNum - sequenceNumber != 1) {
                that.setFailProcess(true, util.descFailList[4]);
                return false;
            }
            sequenceNumber = sequenceNum;
            var fragNum = util.hexToBinArray(list[1]);
            list = util.isEncrypt(that, fragNum, list, getApp().globalData.data.md5Key);
            result = result.concat(list);
            that.setData({
                result: result
            });
            if (that.flagEnd) {
                that.setData({
                    flagEnd: false
                });
                if (type == 1) {
                    if (subType == util.SUBTYPE_NEGOTIATION_NEG) {
                        var arr = util.hexByInt(result.join(''));
                        var clientSecret = client.computeSecret(new Uint8Array(arr));
                        var md5Key = md5.array(clientSecret);
                        getApp().globalData.data.md5Key = md5Key;
                        that.setData({
                            result: []
                        });
                    } else if (subType == 15) {
                        for (var i = 0; i <= result.length; i++) {
                            var num = parseInt(result[i], 16) + '';
                            if (i == 0) {
                                that.setProcess(85, 'Connected: ' + util.successList[num]);
                            } else if (i == 1) {
                                if (num == 0) {
                                    that.setProcess(100, util.descSucList[6]);
                                }
                            }
                        }
                    } else if (subType == 18) {
                        for (var i = 0; i <= result.length; i++) {
                            var num = parseInt(result[i], 16) + '';
                            if (i == 0) {
                                that.setProcess(85, util.successList[num]);
                            } else if (i == 1) {
                                that.setFailProcess(true, util.failList[num]);
                            }
                        }
                    } else {
                        that.setFailProcess(true, util.descFailList[4]);
                    }
                } else {
                    that.setFailProcess(true, util.descFailList[4]);
                }
            }
        },
    
        closeConnect: function () {
            var that = this;
            uni.closeBLEConnection({
                deviceId: that.deviceId,
                success: function (res) {}
            });
        },
    
        setProcess: function (value, desc) {
            var that = this;
            var list = [];
            list = that.processList;
            if (list.indexOf(desc) == -1) {
                list.push(desc);
            }
            if (that.value <= value) {
                that.setData({
                    value: value
                });
            }
            that.setData({
                processList: list
            });
            if (value == 100) {
                that.closeConnect();
                uni.closeBluetoothAdapter();
                that.setData({
                    desc: util.descSucList[6]
                });
                clearInterval(timeId);
                sequenceControl = 0;
                setTimeout(function () {
                    uni.reLaunch({
                        url: '/pages/Index/home/home?next=operate'
                    });
                }, 3000);
            }
        },
    
        setFailProcess: function (flag, desc) {
            var that = this;
            var list = [];
            list = that.processList;
            list.push(desc);
            that.setData({
                failure: flag,
                processList: list
            });
            that.setFailBg();
        },
    
        setFailBg: function () {
            uni.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#737d89'
            });
        },
    
        setSucBg: function () {
            uni.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#e8352c'
            });
        }
    }
};
</script>
<style>
/* pages/blueConnect/blueConnect.wxss */
.container {
    padding: 0;
}
.schedule {
    background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
    height: 46vh;
    width: 100%;
    padding: 50rpx 0;
}
.schedule-result {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
    background: transparent;
    height: 55vw;
    width: 55vw;
    margin: 0 auto;
    color: #fff;
}
.schedule-img {
    height: 55vw;
    width: 55vw;
}
.fail {
    background: #737d89;
}
.desc-wrapper {
    position: absolute;
}
.text-value {
    text-align: center;
    font-size: 20px;
}
.text-desc {
    font-size: 14px;
}
.text-samll {
    font-size: 16px;
}
.text-sigh {
    height: 80rpx;
    width: 80rpx;
    background: #fff;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    color: #737d89;
    margin: 0 auto 10px;
}
.process-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    text-align: left;
    margin-top: 20px;
    padding-left: 30px;
    font-size: 14px;
    color: #999;
}
.text-process {
    margin: 3px 0;
}
</style>
