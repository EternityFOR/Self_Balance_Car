<template>
    <view>
        <van-transition
            v-if="lockScroll"
            :show="show"
            custom-class="van-overlay custom-class"
            :custom-style="'z-index: ' + zIndex + '; ' + customStyle"
            :duration="duration"
            @tap.native="onClick"
            @touchmove.native.stop.prevent="noop"
        >
            <slot></slot>
        </van-transition>
        <van-transition
            v-else
            :show="show"
            custom-class="van-overlay custom-class"
            :custom-style="'z-index: ' + zIndex + '; ' + customStyle"
            :duration="duration"
            @tap.native="onClick"
        >
            <slot></slot>
        </van-transition>
    </view>
</template>

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
    props: {
        show: Boolean,
        customStyle: String,
        duration: {
            type: null,
            default: 300
        },
        zIndex: {
            type: Number,
            default: 1
        },
        lockScroll: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        onClick: function () {
            this.$emit('click');
        },
        // for prevent touchmove
        noop: function () {}
    }
};
</script>
<style>
@import '../common/index.css';
.van-overlay {
    background-color: var(--overlay-background-color, rgba(0, 0, 0, 0.7));
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
}
</style>
