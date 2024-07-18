<template>
    <view :class="utils.bem('share-sheet__options', { border: showBorder })">
        <view class="van-share-sheet__option" :data-index="index" @tap="onSelect" v-for="(item, index) in options" :key="index">
            <button class="van-share-sheet__button" :open-type="item.openType">
                <image :src="computed.getIconURL(item.icon)" class="van-share-sheet__icon" />
                <view v-if="item.name" class="van-share-sheet__name">{{ item.name }}</view>
                <view v-if="item.description" class="van-share-sheet__option-description">
                    {{ item.description }}
                </view>
            </button>
        </view>
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/utils.wxs"></script>
<script module="computed" lang="wxs" src="@/miniprogram_npm/@vant/weapp/share-sheet/options.wxs"></script>
<script>
'use strict';
var __assign =
    (this && this.__assign) ||
    function () {
        __assign =
            Object.assign ||
            function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s) {
                        if (Object.prototype.hasOwnProperty.call(s, p)) {
                            t[p] = s[p];
                        }
                    }
                }
                return t;
            };
        return __assign.apply(this, arguments);
    };
Object.defineProperty(exports, '__esModule', {
    value: true
});
var component_1 = require('../common/component');
export default {
    data() {
        return {};
    },
    props: {
        options: Array,
        showBorder: Boolean
    },
    methods: {
        onSelect: function (event) {
            var index = event.currentTarget.dataset.index;
            var option = this.options[index];
            this.$emit(
                'select',
                __assign(__assign({}, option), {
                    index: index
                })
            );
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-share-sheet__options {
    -webkit-overflow-scrolling: touch;
    display: flex;
    overflow-x: auto;
    overflow-y: visible;
    padding: 16px 0 16px 8px;
    position: relative;
}
.van-share-sheet__options--border:before {
    border-top: 1px solid #ebedf0;
    box-sizing: border-box;
    content: ' ';
    left: 16px;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    transform: scaleY(0.5);
    transform-origin: center;
}
.van-share-sheet__options::-webkit-scrollbar {
    height: 0;
}
.van-share-sheet__option {
    align-items: center;
    display: flex;
    flex-direction: column;
    -webkit-user-select: none;
    user-select: none;
}
.van-share-sheet__option:active {
    opacity: 0.7;
}
.van-share-sheet__button {
    background-color: initial;
    border: 0;
    height: auto;
    line-height: inherit;
    padding: 0;
}
.van-share-sheet__button:after {
    border: 0;
}
.van-share-sheet__icon {
    height: 48px;
    margin: 0 16px;
    width: 48px;
}
.van-share-sheet__name {
    color: #646566;
    font-size: 12px;
    margin-top: 8px;
    padding: 0 4px;
}
.van-share-sheet__option-description {
    color: #c8c9cc;
    font-size: 12px;
    padding: 0 4px;
}
</style>
