<template>
    <view class="container">
        <view class="info-block">
            <text class="hint1">Require Bluetooth function for device searching</text>
            <text class="hint2">(Android needs to open position function)</text>
        </view>
        <scroll-view scroll-y :style="'width:690rpx;height:' + list_height + 'rpx'">
            <block v-for="(item, index) in devicesList" :key="index">
                <view class="list-item" :id="item.deviceId" @tap="Connect">
                    <view style="display: flex; flex-direction: column; width: 80%">
                        <text style="font-size: medium; word-break: break-all">Device name: {{ item.name }}</text>
                        <text style="font-size: x-small; color: gray; word-break: break-all">Device ID: {{ item.deviceId }}</text>
                        <text style="font-size: x-small; color: gray; word-break: break-all">Signal strength RSSI: {{ item.RSSI }}</text>
                    </view>
                    <image style="width: 36px; height: 36px" mode="aspectFit" src="/static/images/bluetooth.png"></image>
                </view>
            </block>
        </scroll-view>
        <van-button
            class="button"
            size="large"
            round
            type="info"
            color="linear-gradient(to right, #4bb0ff, #6149f6)"
            :loading="searching"
            :disabled="autoConnecting"
            @click="Search"
            loading-text="Searching..."
        >
            Search Device
        </van-button>
    </view>
</template>

<script>
const util = require('../../../utils/util.js');
const BLE_util = require('../../../utils/BLE_util');
export default {
    data() {
        return {
            searching: false,
            autoConnecting: false,
            filterName: 'Smart_Car',
            devicesList: [],
            list_height: '',
            connectionAttemptsFlag: true // Flag to control connection attempts
        };
    },
    onLoad: function (options) {
        this.initializePage();
        this.autoConnect();
    },
    onHide: function () {
        this.stopOperations(); // Stop searching and auto-connecting
    },
    onUnload: function () {
        // this.stopOperations(); // Stop searching and auto-connecting
    },
    methods: {
        initializePage: function () {
            const list_height = (getApp().globalData.SystemInfo.windowHeight - 50) * (750 / getApp().globalData.SystemInfo.windowWidth) - 60;
            this.setData({ list_height });

            uni.onBluetoothAdapterStateChange((res) => {
                this.setData({ searching: res.discovering });
                if (!res.available) {
                    this.setData({ searching: false });
                }
            });

            uni.onBluetoothDeviceFound((devices) => {
                this.handleDeviceFound(devices);
            });
        },
        handleDeviceFound: function (devices) {
            let isnotexist = true;
            const device = devices.deviceId ? devices : devices[0] || devices.devices[0];
            if (device) {
                device.advertisData = device.advertisData ? getApp().globalData.buf2hex(device.advertisData) : '';

                for (let i = 0; i < this.devicesList.length; i++) {
                    if (device.deviceId === this.devicesList[i].deviceId) {
                        isnotexist = false;
                        break;
                    }
                }

                if (isnotexist && device.name === this.filterName) {
                    this.devicesList.push(device);
                }
            }

            this.setData({ devicesList: this.devicesList });
        },
        toggleBluetoothAdapter: function (shouldStartSearching) {
            if (!shouldStartSearching) {
                this.stopBluetoothAdapter();
            } else {
                this.startBluetoothAdapter();
            }
        },
        stopBluetoothAdapter: function () {
            uni.closeBluetoothAdapter({
                complete: (res) => {
                    console.log(res);
                    this.setData({ searching: false, devicesList: [] });
                }
            });
        },
        startBluetoothAdapter: function () {
            uni.closeBluetoothAdapter({
                complete: (res) => {
                    console.log(res);
                    uni.openBluetoothAdapter({
                        success: (res) => {
                            console.log(res);
                            uni.getBluetoothAdapterState({
                                success: (res) => {
                                    console.log(res);
                                }
                            });
                            uni.startBluetoothDevicesDiscovery({
                                allowDuplicatesKey: false,
                                success: (res) => {
                                    console.log(res);
                                    this.setData({ searching: true, devicesList: [] });
                                }
                            });
                        },
                        fail: (res) => {
                            util.showToast('Please turn on Bluetooth and positioning function');
                        }
                    });
                }
            });
        },
        Search: function () {
            this.toggleBluetoothAdapter(!this.searching);
        },
        Connect: function (e) {
            console.log(e);
            const device = { deviceId: e.currentTarget.id, name: e.currentTarget.name };
            this.connectToDevice(device);
        },
        connectToDevice: function (device) {
            const maxRetries = 3;
            let attempt = 0;
            this.connectionAttemptsFlag = true; // Allow connection attempts

            const tryConnect = () => {
                if (!this.connectionAttemptsFlag) {
                    console.log('Connection attempts stopped');
                    return;
                }

                if (attempt >= maxRetries) {
                    uni.hideLoading();
                    uni.showToast({ title: 'Connection failed', icon: 'none', duration: 2000 });
                    console.error('Failed to connect after', maxRetries, 'attempts');
                    this.setData({ autoConnecting: false });
                    return;
                }

                attempt++;
                console.log(`Attempt ${attempt} to connect to device ${device.deviceId}`);

                uni.stopBluetoothDevicesDiscovery({
                    success: () => {
                        this.setData({ searching: false });
                    },
                    fail: (err) => {
                        console.error('Failed to stopBluetoothDevicesDiscovery:', err);
                    }
                });

                uni.showLoading({ title: 'Connecting Bluetooth device...' });

                uni.createBLEConnection({
                    deviceId: device.deviceId,
                    timeout: 10000,
                    success: () => {
                        setTimeout(() => {
                            uni.setBLEMTU({
                                deviceId: device.deviceId,
                                mtu: 128,
                                success: () => {
                                    console.log(device.deviceId);
                                    uni.hideLoading();
                                    uni.showToast({ title: 'Succeeded', icon: 'success', duration: 1000 });
                                    setTimeout(() => {
                                        this.getDeviceServices(device);
                                    }, 1000);
                                },
                                fail(err) {
                                    console.log('SetMTU Failed', err);
                                }
                            });
                        }, 1000);
                    },
                    fail: (err) => {
                        console.error('Failed to connect:', err);
                        setTimeout(tryConnect, 1000);  // Retry after 1 second
                    }
                });
            };

            tryConnect();
        },
        getDeviceServices: function (device) {
            const targetServiceId = getApp().globalData.data.service_uuid;
            uni.getBLEDeviceServices({
                deviceId: device.deviceId,
                success: (serviceRes) => {
                    let matchedService = serviceRes.services.find(service => service.uuid === targetServiceId);
                    if (matchedService) {
                        const serviceId = matchedService.uuid;
                        getApp().globalData.data.serviceId = serviceId;
                        getApp().globalData.data.connectedDeviceId = device.deviceId;
                        getApp().globalData.data.name = device.name;
                        uni.setStorageSync('connectedDeviceId', getApp().globalData.data.connectedDeviceId);
                        uni.setStorageSync('serviceId', getApp().globalData.data.serviceId);
                        uni.setStorageSync('name', getApp().globalData.data.name);
                        this.navigateToPage();
                    } else {
                        uni.showToast({ title: 'No services found', icon: 'none', duration: 2000 });
                    }
                },
                fail: (err) => {
                    uni.hideLoading();
                    uni.showToast({ title: 'Failed to get services', icon: 'none', duration: 2000 });
                    console.error('Failed to get services:', err);
                }
            });
        },
        autoConnect: function () {
            this.setData({ autoConnecting: true });
            uni.openBluetoothAdapter({
                success: (res) => {
                    console.log('Bluetooth adapter opened successfully', res);
                    this.checkBluetoothAdapterAndConnect();
                },
                fail: (err) => {
                    console.log('Failed to open Bluetooth adapter', err);
                    util.showToast('Please turn on Bluetooth and Position function');
                    this.setData({ autoConnecting: false });
                }
            });
        },
        checkBluetoothAdapterAndConnect: function () {
            const serviceId = uni.getStorageSync('serviceId');
            const deviceId = uni.getStorageSync('connectedDeviceId');
            if (!deviceId || !serviceId) {
                util.showToast('For the first time to connect the device, please click to search');
                console.log('No stored device information, Please Search');
                this.setData({ autoConnecting: false });
                return;
            }

            uni.getBluetoothAdapterState({
                success: (res) => {
                    if (res.available) {
                        uni.getConnectedBluetoothDevices({
                            services: [serviceId],
                            success: (res) => {
                                if (res.devices.some((device) => device.deviceId === deviceId)) {
                                    console.log('Device already connected, no need to reconnect', deviceId);
                                    this.navigateToPage();
                                } else {
                                    this.connectToDevice({ deviceId, name: getApp().globalData.data.name });
                                }
                            },
                            fail: () => {
                                this.connectToDevice({ deviceId, name: getApp().globalData.data.name });
                            }
                        });
                    } else {
                        console.log('Bluetooth adapter not available');
                        util.showToast('Please turn on Bluetooth and Position function');
                    }
                },
                fail: (res) => {
                    console.log('Failed to get Bluetooth adapter state', res);
                    util.showToast('Please turn on Bluetooth and Position function');
                }
            });
        },
        navigateToPage: function () {
            const page = getApp().globalData.page;
            if (page === 0) {
                BLE_util.Write_data_BLE({ "Type": "BLUFI" }).then(() => {
                    console.log('Successfully send BLUFI COMMAND!');
                    uni.openBluetoothAdapter({
                        success(res) {
                            console.log(res);
                            uni.startBluetoothDevicesDiscovery({
                                success: function (res) {
                                    uni.redirectTo({ url: '/pages/BLE_WIFI/BLUFI/bluDevices' });
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
            } else if (page === 1) {
                uni.redirectTo({ url: '/pages/Control/device/device' });
            }
        },
        stopOperations: function () {
            this.toggleBluetoothAdapter(false); // Stop searching
            this.connectionAttemptsFlag = false; // Stop auto-connecting
            this.setData({ autoConnecting: false });
        }
    }
};
</script>
<style>
page {
    background-color: #f8f8f8;
}
.container {
    padding: 0 30rpx 0 30rpx;
    align-items: center;
}
.list-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px 0 10px 0;
    box-sizing: border-box;
    border: 1px solid #000;
    border-style: none none solid none;
    border-bottom-color: lightgray;
}
.list-item:last-child {
    border-style: none;
}
.button {
    position: fixed;
    width: 690rpx;
    bottom: 30rpx;
}
.info-block {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.hint1 {
    left: 25rpx;
    top: 10rpx;
    font-size: 29rpx;
    font-weight: bold;
}
.hint2 {
    left: 25rpx;
    top: 10rpx;
    font-size: 20rpx;
}
</style>
