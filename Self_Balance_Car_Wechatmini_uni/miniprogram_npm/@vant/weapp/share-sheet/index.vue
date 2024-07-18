<template>
    <view>
        <van-popup
            round
            class="van-share-sheet"
            :show="show"
            position="bottom"
            :overlay="overlay"
            :duration="duration"
            :z-index="zIndex"
            :overlay-style="overlayStyle"
            :close-on-click-overlay="closeOnClickOverlay"
            :safe-area-inset-bottom="safeAreaInsetBottom"
            @close="onClose"
            @click-overlay="onClickOverlay"
        >
            <view class="van-share-sheet__header">
                <view class="van-share-sheet__title">
                    <slot name="title" />
                </view>
                <view v-if="title" class="van-share-sheet__title">{{ title }}</view>

                <view class="van-share-sheet__description">
                    <slot name="description" />
                </view>
                <view v-if="description" class="van-share-sheet__description">
                    {{ description }}
                </view>
            </view>

            <block v-if="computed.isMulti(options)">
                <options :show-border="index !== 0" :options="item" @select="onSelect" v-for="(item, index) in options" :key="index"></options>
            </block>

            <options v-else :options="options" @select="onSelect" />

            <button type="button" class="van-share-sheet__cancel" @tap="onCancel">
                {{ cancelText }}
            </button>
        </van-popup>
    </view>
</template>
<script module="computed" lang="wxs" src="@/miniprogram_npm/@vant/weapp/share-sheet/index.wxs"></script>
<script>
'use strict';
import options from './options';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var component_1 = require('../common/component');
export default {
    components: {
        options
    },
    data() {
        return {};
    },
    props: {
        // whether to show popup
        show: Boolean,
        // overlay custom style
        overlayStyle: String,
        // z-index
        zIndex: {
            type: Number,
            default: 100
        },
        title: String,
        cancelText: {
            type: String,
            default: '取消'
        },
        description: String,
        options: {
            type: Array,
            default: () => []
        },
        overlay: {
            type: Boolean,
            default: true
        },
        safeAreaInsetBottom: {
            type: Boolean,
            default: true
        },
        closeOnClickOverlay: {
            type: Boolean,
            default: true
        },
        duration: {
            type: null,
            default: 300
        }
    },
    methods: {
        onClickOverlay: function () {
            this.$emit('click-overlay');
        },
        onCancel: function () {
            this.onClose();
            this.$emit('cancel');
        },
        onSelect: function (event) {
            this.$emit('select', event.detail);
        },
        onClose: function () {
            this.$emit('close');
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-share-sheet__header {
    padding: 12px 16px 4px;
    text-align: center;
}
.van-share-sheet__title {
    color: #323233;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    margin-top: 8px;
}
.van-share-sheet__title:empty,
.van-share-sheet__title:not(:empty) + .van-share-sheet__title {
    display: none;
}
.van-share-sheet__description {
    color: #969799;
    display: block;
    font-size: 12px;
    line-height: 16px;
    margin-top: 8px;
}
.van-share-sheet__description:empty,
.van-share-sheet__description:not(:empty) + .van-share-sheet__description {
    display: none;
}
.van-share-sheet__cancel {
    background: #fff;
    border: none;
    box-sizing: initial;
    display: block;
    font-size: 16px;
    height: auto;
    line-height: 48px;
    padding: 0;
    text-align: center;
    width: 100%;
}
.van-share-sheet__cancel:before {
    background-color: #f7f8fa;
    content: ' ';
    display: block;
    height: 8px;
}
.van-share-sheet__cancel:after {
    display: none;
}
.van-share-sheet__cancel:active {
    background-color: #f2f3f5;
}
</style>
