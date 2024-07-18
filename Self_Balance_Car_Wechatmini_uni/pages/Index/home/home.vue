<template>
    <!-- index.wxml -->
    <view class="content-wrapper">
        <view class="btn-info">
            <view @tap="bindViewBLUFI" class="flex-1 flex flex-v flex-jcc flex-ac">
                <text class="btn-icon iconfont icon-peiwang"></text>
                <text class="name_left" style="position: relative; left: 10rpx">WIFI Connection</text>
            </view>
            <view @tap="bindViewControl" class="flex-1 flex flex-v flex-jcc flex-ac">
                <text class="btn-icon iconfont icon-kongzhi"></text>
                <text class="name_right">Car Control</text>
            </view>
        </view>
    </view>
</template>

<script>
//index.js
//获取应用实例
const util = require('../../../utils/util.js');
const ble = require('../../BLE_WIFI/BLE/BLE');
const BLE_util = require('../../../utils/BLE_util');
export default {
    data() {
        return {
            name: '',
            connectedDeviceId: '',
            serviceId: 0,
            selected: 0
        };
    },
    methods: {
        handlePageShow() {
            if (typeof this.getTabBar === 'function' && this.getTabBar()) {
                this.getTabBar().setData({
                    selected: 0
                });
            }
        },

        bindViewBLUFI: function () {
            BLE_util.isBluetoothConnected()
                .then((isConnected) => {
                    if (isConnected) {
						BLE_util.Write_data_BLE({ "Type": "BLUFI" }).then(() => {
							console.log('Successfully send BLUFI COMMAND!');
							uni.openBluetoothAdapter({
							  success(res) {
							    console.log(res);
							    uni.startBluetoothDevicesDiscovery({
							      success: function (res) {
							        uni.redirectTo({ url: '/pages/BLE_WIFI/BLUFI/blueDevices/blueDevices' });
							      }
							    });
							  },
							  fail(res) {
							    util.showToast("BLUETOOTH OFF");
							  }
							});
						  }).catch(err => {
						    console.error('Failed to send control signal to device', err);
						    util.showToast('Failed to send control signal');
						  });
					} 
					else 
					{
                        getApp().globalData.page = 0;
                        uni.navigateTo({
                            url: '/pages/BLE_WIFI/BLE/BLE'
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error checking Bluetooth connection', error);
                    util.showToast('Error checking Bluetooth connection');
                });
        },

        bindViewControl: function () {
            BLE_util.isBluetoothConnected()
                .then((isConnected) => {
                    if (isConnected) {
                        uni.navigateTo({
                            url: '/pages/Control/device/device'
                        });
                    } else {
                        getApp().globalData.page = 1;
                        uni.navigateTo({
                            url: '/pages/BLE_WIFI/BLE/BLE'
                        });
                    }
                })
                .catch((error) => {
                    console.error('Check the Bluetooth connection failure：', error);
                });
        },

        onLoad: function (option) {
            uni.getSystemInfo({
                success(res) {
                    getApp().globalData.data.system = res.platform;
                }
            });
        }
    },
    created: function () {}
};
</script>
<style>
.container {
    display: block;
    padding: 0;
    height: 100vh;
    background: #eee;
}
.title {
    margin: 10px 0;
    text-align: center;
    font-size: 16px;
}
.btn-info {
    display: flex;
    margin-top: 20vh;
}
.btn-icon {
    font-size: 120rpx;
    color: #0084ff;
}
.icon-kongzhi {
    color: #d22ef3;
}
.name_left {
    margin: 10rpx;
	margin-left: 20rpx;
    font-size: 30rpx;
}
.name_right {
    margin: 10rpx;
	margin-left: 40rpx;
    font-size: 30rpx;
}
</style>
