<script>
//app.js

export default {
    data() {
        return {};
    },
    globalData: {
        SystemInfo: {},
        userInfo: null,
        payload: null,

        data: {
            //Bluetooth连接的配置
            service_uuid: '0000ABF0-0000-1000-8000-00805F9B34FB',
            characteristic_write_uuid: '0000ABF1-0000-1000-8000-00805F9B34FB',
            characteristic_read_uuid: '0000ABF2-0000-1000-8000-00805F9B34FB',
			service_uuid_blufi: "0000FFFF-0000-1000-8000-00805F9B34FB",
			characteristic_write_uuid_blufi: "0000FF01-0000-1000-8000-00805F9B34FB",
			characteristic_read_uuid_blufi: "0000FF02-0000-1000-8000-00805F9B34FB",
			serviceId: 0,
            connectedDeviceId:'',
            name: '',
			md5Key: '',
			system: 'android',
            page: 0
        },

        buf2hex: function (buffer) {
            return Array.prototype.map.call(new Uint8Array(buffer), (x) => ('00' + x.toString(16)).slice(-2)).join('');
        },

        buf2string: function (buffer) {
            var arr = Array.prototype.map.call(new Uint8Array(buffer), (x) => x);
            var str = '';
            for (var i = 0; i < arr.length; i++) {
                str += String.fromCharCode(arr[i]);
            }
            return str;
        }
    },
    onLaunch: function (buffer) {}
};
</script>
<style>
@import './fonts/font.css';
@import 'weui.css';
.container {
    height: 100vh;
    background: #ffffff;
    font-size: 32rpx;
}
/* flex布局 */
.flex {
    display: flex;
}
/* flex布局-水平居中 */
.flex-jcc {
    justify-content: center;
}
/* flex布局-垂直居中 */
.flex-ac {
    align-items: center;
}
/* flex布局-水平两端显示 */
.flex-jcb {
    justify-content: space-between;
}
.flex-v {
    flex-direction: column;
}
.flex-1 {
    flex: 1;
}
.header-wrapper {
    height: 55vh;
    width: 100%;
    background: #ffffff;
    border-bottom-right-radius: 80rpx;
    border-bottom-left-radius: 80rpx;
}
.header-image {
    width: 29vh;
    height: 29vh;
    position: relative;
    top: -7.5vh;
}
.content-wrapper {
    position: absolute;
    top: 43vh;
    left: 30rpx;
    min-height: 50vh;
    width: calc(100% - 60rpx);
    padding: 60rpx 40rpx;
    box-sizing: border-box;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0px 0px 6rpx #fff;
    color: #818181;
}
.btn {
    width: 100%;
    font-size: 28rpx;
    padding: 8rpx 0;
    background-image: linear-gradient(to top, #00c6fb 0%, #005bea 100%);
    border: 1px solid #00f2fe;
    color: #fff;
    border-radius: 100rpx;
}
</style>
