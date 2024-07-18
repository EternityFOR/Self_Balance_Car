<template>
    <view class="container">
        <view class="header-wrapper flex flex-jcc flex-ac">
            <text class="iconfont icon-peiwang"></text>
        </view>
        <view class="content-wrapper">
            <view class="item flex">
                <label>SSID:</label>
                <text>{{ wifiInfo.SSID }}</text>
            </view>
            <view class="item flex">
                <label>BSSID:</label>
                <text>{{ wifiInfo.BSSID }}</text>
            </view>
            <view class="item flex pwd-wrap">
                <label>Password:</label>
                <input class="felx-1" placeholder="Please enter the Wi-Fi password" placeholder-class="placeholder-color" @input="bindPasswordInput" />
            </view>
            <button class="btn" @tap="gotoProvision">Start</button>
        </view>
    </view>
</template>

<script>
const util = require('../../../../utils/util.js');
export default {
    data() {
        return {
            wifiInfo: null,
            deviceId: '',
            password: ''
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {
        console.log(options);
        this.setData({
            deviceId: options.deviceId
        });
        this.getWifiInfo();
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
        uni.offWifiConnected({});
        uni.stopWifi({});
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
        bindPasswordInput: function (e) {
            this.setData({
                password: e.detail.value
            });
        },

        getWifiInfo: function () {
            const that = this;
            uni.startWifi({
                success(res) {
                    console.log(res);
                    // 先取一次，防止IOS获取不到
                    uni.getConnectedWifi({
                        success(res) {
                            that.setData({
                                wifiInfo: res.wifi
                            });
                        }
                    });
                    uni.onWifiConnected(function (res) {
                        that.setData({
                            wifiInfo: res.wifi
                        });
                    });
                },
                fail(res) {
                    console.log(res);
                }
            });
        },

        gotoProvision: function () {
            const wifiInfo = this.wifiInfo;
            const ssid = wifiInfo != null ? wifiInfo.SSID : null;
            const bssid = wifiInfo != null ? wifiInfo.BSSID : null;
            const password = this.password;
            if (wifiInfo == null) {
                util.showToast('No Wi-Fi connection');
                return;
            }
            const info = {
                ssid: ssid,
                bssid: bssid,
                password: password,
                deviceId: this.deviceId
            };
            uni.navigateTo({
                url: '/pages/BLE_WIFI/BLUFI/blueConnect/blueConnect',
                success: function (res) {
                    res.eventChannel.emit('dataFromPrepare', info);
                }
            });
        }
    }
};
</script>
<style>
.item {
    height: 90rpx;
    line-height: 90rpx;
    border-bottom: 1px solid #e1e1e1;
    margin-bottom: 30rpx;
    padding: 0 10rpx;
    color: #b9b9b9;
    box-sizing: border-box;
}
label {
    flex: 0 0 190rpx;
}
input {
    flex: 1;
    display: inline-block;
    height: 100%;
    border-radius: 10rpx;
    color: #b9b9b9;
}
.placeholder-color {
    color: #b9b9b9;
}
.btn {
    margin-top: 80rpx;
}
.icon-peiwang {
    position: relative;
    top: -7.5vh;
    font-size: 120px;
    padding: 30px;
    color: #fff;
    border: 6rpx solid #fff;
    border-radius: 100%;
}
</style>
