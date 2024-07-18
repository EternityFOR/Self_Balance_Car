<template>
    <view
        :class="utils.bem('switch', { on: checked === activeValue, disabled }) + ' custom-class'"
        :style="computed.rootStyle({ size, checked, activeColor, inactiveColor, activeValue })"
        @tap="onClick"
    >
        <view class="van-switch__node node-class">
            <van-loading v-if="loading" :color="computed.loadingColor({ checked, activeColor, inactiveColor, activeValue })" custom-class="van-switch__loading" />
        </view>
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/utils.wxs"></script>
<script module="computed" lang="wxs" src="@/miniprogram_npm/@vant/weapp/switch/index.wxs"></script>
<script>
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var component_1 = require('../common/component');
export default {
    data() {
        return {};
    },
    field: true,
    classes: ['node-class'],
    props: {
        checked: null,
        loading: Boolean,
        disabled: Boolean,
        activeColor: String,
        inactiveColor: String,
        size: {
            type: String,
            default: '30'
        },
        activeValue: {
            type: null,
            default: true
        },
        inactiveValue: {
            type: null,
            default: false
        }
    },
    methods: {
        onClick: function () {
            var _a = this;
            var activeValue = _a.activeValue;
            var inactiveValue = _a.inactiveValue;
            var disabled = _a.disabled;
            var loading = _a.loading;
            if (disabled || loading) {
                return;
            }
            var checked = this.checked === activeValue;
            var value = checked ? inactiveValue : activeValue;
            this.$emit('input', value);
            this.$emit('change', value);
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-switch {
    background-color: var(--switch-background-color, #fff);
    border: var(--switch-border, 1px solid rgba(0, 0, 0, 0.1));
    border-radius: var(--switch-node-size, 1em);
    box-sizing: initial;
    display: inline-block;
    height: var(--switch-height, 1em);
    position: relative;
    transition: background-color var(--switch-transition-duration, 0.3s);
    width: var(--switch-width, 2em);
}
.van-switch__node {
    background-color: var(--switch-node-background-color, #fff);
    border-radius: 100%;
    box-shadow: var(--switch-node-box-shadow, 0 3px 1px 0 rgba(0, 0, 0, 0.05), 0 2px 2px 0 rgba(0, 0, 0, 0.1), 0 3px 3px 0 rgba(0, 0, 0, 0.05));
    height: var(--switch-node-size, 1em);
    left: 0;
    position: absolute;
    top: 0;
    transition: var(--switch-transition-duration, 0.3s) cubic-bezier(0.3, 1.05, 0.4, 1.05);
    width: var(--switch-node-size, 1em);
    z-index: var(--switch-node-z-index, 1);
}
.van-switch__loading {
    height: 50%;
    left: 25%;
    position: absolute !important;
    top: 25%;
    width: 50%;
}
.van-switch--on {
    background-color: var(--switch-on-background-color, #1989fa);
}
.van-switch--on .van-switch__node {
    transform: translateX(calc(var(--switch-width, 2em) - var(--switch-node-size, 1em)));
}
.van-switch--disabled {
    opacity: var(--switch-disabled-opacity, 0.4);
}
</style>
