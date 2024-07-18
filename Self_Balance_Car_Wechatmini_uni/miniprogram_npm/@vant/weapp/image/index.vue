<template>
    <view :style="computed.rootStyle({ width, height, radius })" :class="'custom-class ' + utils.bem('image', { round })" @tap="onClick">
        <image
            v-if="!error"
            :src="src"
            :mode="computed.mode(fit)"
            :lazy-load="lazyLoad"
            :webp="webp"
            class="image-class van-image__img"
            :show-menu-by-longpress="showMenuByLongpress"
            @load="onLoad"
            @error="onError"
        />

        <view v-if="loading && showLoading" class="loading-class van-image__loading">
            <slot v-if="useLoadingSlot" name="loading" />
            <van-icon v-else name="photo" custom-class="van-image__loading-icon" />
        </view>
        <view v-if="error && showError" class="error-class van-image__error">
            <slot v-if="useErrorSlot" name="error" />
            <van-icon v-else name="photo-fail" custom-class="van-image__error-icon" />
        </view>
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/utils.wxs"></script>
<script module="computed" lang="wxs" src="@/miniprogram_npm/@vant/weapp/image/index.wxs"></script>
<script>
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var component_1 = require('../common/component');
var button_1 = require('../mixins/button');
export default {
    data() {
        return {
            error: false,
            loading: true,
            viewStyle: ''
        };
    },
    mixins: [button_1.button],
    classes: ['custom-class', 'loading-class', 'error-class', 'image-class'],
    props: {
        src: {
            type: String
        },
        round: Boolean,
        width: null,
        height: null,
        radius: null,
        lazyLoad: Boolean,
        useErrorSlot: Boolean,
        useLoadingSlot: Boolean,
        showMenuByLongpress: Boolean,
        fit: {
            type: String,
            default: 'fill'
        },
        webp: {
            type: Boolean,
            default: false
        },
        showError: {
            type: Boolean,
            default: true
        },
        showLoading: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        onLoad: function (event) {
            this.setData({
                loading: false
            });
            this.$emit('load', event.detail);
        },
        onError: function (event) {
            this.setData({
                loading: false,
                error: true
            });
            this.$emit('error', event.detail);
        },
        onClick: function (event) {
            this.$emit('click', event.detail);
        }
    },
    watch: {
        src: {
            handler: function () {
                this.setData({
                    error: false,
                    loading: true
                });
            },

            immediate: true
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-image {
    display: inline-block;
    position: relative;
}
.van-image--round {
    border-radius: 50%;
    overflow: hidden;
}
.van-image--round .van-image__img {
    border-radius: inherit;
}
.van-image__error,
.van-image__img,
.van-image__loading {
    display: block;
    height: 100%;
    width: 100%;
}
.van-image__error,
.van-image__loading {
    align-items: center;
    background-color: var(--image-placeholder-background-color, #f7f8fa);
    color: var(--image-placeholder-text-color, #969799);
    display: flex;
    flex-direction: column;
    font-size: var(--image-placeholder-font-size, 14px);
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
}
.van-image__loading-icon {
    color: var(--image-loading-icon-color, #dcdee0);
    font-size: var(--image-loading-icon-size, 32px) !important;
}
.van-image__error-icon {
    color: var(--image-error-icon-color, #dcdee0);
    font-size: var(--image-error-icon-size, 32px) !important;
}
</style>
