function isBluetoothConnected() {
    return new Promise((resolve, reject) => {
        uni.getConnectedBluetoothDevices({
            // services: ['0000ABF0-0000-1000-8000-00805F9B34FB'],
            success: function (res) {
                if (res.devices && res.devices.length > 0) {
                    // 如果设备列表不为空，则认为至少有一个蓝牙设备已连接
                    console.log('DEVICES:',res.devices);
					console.log('NUM_OF_DEVICES:',res.devices.length);
                    resolve(true);
                } else {
                    // 设备列表为空，没有蓝牙设备连接
                    resolve(false);
                }
            },
            fail: function (err) {
                // 调用失败，通常意味着蓝牙适配器未初始化或不可用
                // 根据错误码决定是否认为没有设备连接或者是否要报告一个错误
                if (err.errCode === 10000 || err.errCode === 10001) {
                    // 蓝牙适配器未初始化或不可用，可以认为没有设备连接
                    resolve(false);
                } else {
                    // 其他错误，将错误信息传递出去
                    reject(err);
                }
            }
        });
    });
}
function Write_data_BLE(signal) {
    return new Promise((resolve, reject) => {
        const signalString = JSON.stringify(signal);
        console.log('Sending control signal string:', signalString);
        let buffer = new ArrayBuffer(signalString.length);
        let dataView = new DataView(buffer);
        for (let i = 0; i < signalString.length; i++) {
            dataView.setUint8(i, signalString.charCodeAt(i));
        }

        const serviceId = getApp().globalData.data.serviceId;
        const deviceId = getApp().globalData.data.connectedDeviceId;
        const characteristicId = getApp().globalData.data.characteristic_write_uuid;
		uni.writeBLECharacteristicValue({
			deviceId: deviceId,
			serviceId: serviceId,
			characteristicId: characteristicId,
			value: buffer,
			success: function (res) {
				console.log('Send control signal buffer success', res);
				resolve(res);
			},
			fail: function (err) {
				console.log('SERVICEID:', serviceId);
				console.log('DEVICEID:', deviceId);
				console.log('CHARACTERISTICID:', characteristicId);
				console.error('Send control signal failed', err);
				reject(err);
				getApp().globalData.page = 1;
				uni.redirectTo({
					url: '/pages/BLE_WIFI/BLE/BLE'
				});
			}
		});
    });
}
module.exports = {
    isBluetoothConnected: isBluetoothConnected,
    Write_data_BLE: Write_data_BLE
};
