<template>
    <!-- index.wxml -->
    <view class="container">
        <view :data-value="item.deviceId" @tap="bindViewConnect" class="item" v-for="(item, index) in deviceList" :key="index">
            <view class="item-img">
                <text class="iconfont icon-peiwang"></text>
            </view>

            <view class="item-name">
                <text class="text-name">{{ item.name }}</text>
                <text class="text-rssi">Rssi: {{ item.RSSI }}</text>
            </view>
        </view>
    </view>
</template>

<script>
//获取应用实例
const util = require('../../../../utils/util.js');
var scanList = [];
export default {
    data() {
        return {
            deviceList: [],
            deviceId: '',
            blueConnectNum: '',
			isConnecting: false,
        };
    },
    onLoad: function () {
        var that = this;
		var deviceId = that.deviceId;
		that.getBluDevice();
        uni.setNavigationBarTitle({
            title: 'Bluetooth Search'
        });
        uni.showLoading({
            title: 'Searching...'
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
		uni.stopBluetoothDevicesDiscovery();
	},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
    methods: {
        bindViewConnect(event) {
			var that = this;
			if (that.isConnecting) {
				return;
			}
			that.isConnecting = true;  // 设置正在连接状态
			var deviceId = event.currentTarget.dataset.value;
			var maxRetries = 3;
			var attempt = 0;

			that.setData({
				deviceId: deviceId
			});

			const tryConnect = () => {
				if (attempt >= maxRetries) {
					console.log('Failed to connect after', maxRetries, 'attempts');
					that.setFailProcess(true, util.descFailList[0]);
					that.isConnecting = false;
					return;
				}

				attempt++;
				console.log(`Attempt ${attempt} to connect to device ${deviceId}`);

				uni.closeBLEConnection({
					deviceId: deviceId,
					success: function (res) {
						console.log('Connection closed successfully');
						uni.createBLEConnection({
							deviceId: that.deviceId,
							timeout: 10000,
							success: () => {
								setTimeout(() => {
									uni.setBLEMTU({
										deviceId: that.deviceId,
										mtu: 128,
										success: () => {
											console.log(that.deviceId);
											console.log('Connection Successfully!');
											uni.navigateTo({
												url: '/pages/BLE_WIFI/BLUFI/blueWifi/blueWifi?deviceId=' + deviceId
											});
											that.isConnecting = false; // 连接成功，恢复点击状态
										},
										fail(err) {
											console.log('SetMTU Failed', err);
											that.isConnecting = false; // 设置 MTU 失败，恢复点击状态
										}
									});
								}, 1000);
							},
							fail: function (res) {
								console.log('Connection failed', res);
								console.log(that.blueConnectNum);
								setTimeout(tryConnect, 1000); // Retry after 1 second
							}
						});
					},
					fail: function (res) {
						console.log('Connection close failed');
						console.log(res.errCode, res.errMsg);
						that.isConnecting = false; // 关闭连接失败，恢复点击状态
					}
				});
			};

			tryConnect();
		},
		getBluDevice: function () {
            var that = this;
            uni.startBluetoothDevicesDiscovery({
                success: function (res) {
                    uni.onBluetoothDeviceFound(function (res) {
                        if (res.devices && res.devices.length > 0) {
                            var list = util.filterDevice(res.devices, 'name');
                            // console.log(list);
                            if (list.length > 0) {
                                var deviceList = that.deviceList;
                                uni.hideLoading();
                                list.forEach(function (item) {
                                    var flag = true;
                                    for (var i = 0; i < deviceList.length; i++) {
                                        var itemSub = deviceList[i];
                                        if (itemSub.deviceId === item.deviceId) {
                                            flag = false;
                                            break;
                                        }
                                    }
                                    if (flag) {
                                        deviceList.push(item);
                                    }
                                });
                                that.setData({
                                    deviceList: deviceList
                                });
                            }
                        }
                    });
                }
            });
        }
    }
};
</script>
<style>
/* pages/blueDevices/blueDevices.wxss */
.prompt-title {
    height: 50rpx;
    border-top: 1px solid #999;
    border-bottom: 1px solid #999;
    width: 100%;
}
.item {
    display: flex;
    height: 130rpx;
    width: 100%;
    padding: 30rpx;
    align-items: center;
    border-bottom: 1px solid #eee;
    background: #fff;
    box-sizing: border-box;
}
.item-img {
    flex: 0 0 90rpx;
    height: 90rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
    background: #f6f6f6;
    box-shadow: 0 0 10px #f6f6f6;
}
.icon-peiwang {
    font-size: 50rpx;
    color: #e8352c;
}
.item-name {
    flex: 1;
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    font-size: 32rpx;
}
.text-rssi {
    font-size: 28rpx;
    color: #999;
}
</style>
