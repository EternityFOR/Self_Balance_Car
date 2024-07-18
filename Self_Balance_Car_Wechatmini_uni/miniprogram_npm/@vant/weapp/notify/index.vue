<template>
    <view>
        <van-transition name="slide-down" :show="show" custom-class="van-notify__container" :custom-style="computed.rootStyle({ zIndex, top })" @tap.native="onTap">
            <view :class="'van-notify van-notify--' + type" :style="computed.notifyStyle({ background, color })">
                <view v-if="safeAreaInsetTop" :style="'height: ' + statusBarHeight + 'px'" />
                <text>{{ message }}</text>
            </view>
        </van-transition>
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/utils.wxs"></script>
<script module="computed" lang="wxs" src="@/miniprogram_npm/@vant/weapp/notify/index.wxs"></script>
<script>
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var component_1 = require('../common/component');
var color_1 = require('../common/color');
var utils_1 = require('../common/utils');
export default {
    data() {
        return {
            show: false,
            onOpened: null,
            onClose: null,
            onClick: null,
            statusBarHeight: ''
        };
    },
    props: {
        message: String,
        background: String,
        type: {
            type: String,
            default: 'danger'
        },
        color: {
            type: String,
            default: color_1.WHITE
        },
        duration: {
            type: Number,
            default: 3000
        },
        zIndex: {
            type: Number,
            default: 110
        },
        safeAreaInsetTop: {
            type: Boolean,
            default: false
        },
        top: null
    },
    created: function () {
        var statusBarHeight = (0, utils_1.getSystemInfoSync)().statusBarHeight;
        this.setData({
            statusBarHeight: statusBarHeight
        });
    },
    methods: {
        showFun: function () {
            var that = this;
            var _a = this;
            var duration = _a.duration;
            var onOpened = _a.onOpened;
            clearTimeout(this.timer);
            this.setData({
                show: true
            });
            this.$nextTick(onOpened);
            if (duration > 0 && duration !== Infinity) {
                this.timer = setTimeout(function () {
                    that.hide();
                }, duration);
            }
        },
        hide: function () {
            var onClose = this.onClose;
            clearTimeout(this.timer);
            this.setData({
                show: false
            });
            this.$nextTick(onClose);
        },
        onTap: function (event) {
            var onClick = this.onClick;
            if (onClick) {
                onClick(event.detail);
            }
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-notify {
    word-wrap: break-word;
    font-size: var(--notify-font-size, 14px);
    line-height: var(--notify-line-height, 20px);
    padding: var(--notify-padding, 6px 15px);
    text-align: center;
}
.van-notify__container {
    box-sizing: border-box;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
}
.van-notify--primary {
    background-color: var(--notify-primary-background-color, #1989fa);
}
.van-notify--success {
    background-color: var(--notify-success-background-color, #07c160);
}
.van-notify--danger {
    background-color: var(--notify-danger-background-color, #ee0a24);
}
.van-notify--warning {
    background-color: var(--notify-warning-background-color, #ff976a);
}
</style>
