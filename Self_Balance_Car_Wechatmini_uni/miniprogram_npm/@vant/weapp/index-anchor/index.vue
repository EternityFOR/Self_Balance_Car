<template>
    <view class="van-index-anchor-wrapper" :style="wrapperStyle">
        <view :class="'van-index-anchor ' + (active ? 'van-index-anchor--active van-hairline--bottom' : '')" :style="anchorStyle">
            <slot v-if="useSlot" />
            <block v-else>
                <text>{{ index }}</text>
            </block>
        </view>
    </view>
</template>

<script>
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var utils_1 = require('../common/utils');
var component_1 = require('../common/component');
var relation_1 = require('../common/relation');
export default {
    data() {
        return {
            active: false,
            wrapperStyle: '',
            anchorStyle: ''
        };
    },
    relation: (0, relation_1.useParent)('index-bar'),
    props: {
        useSlot: Boolean,
        index: null
    },
    methods: {
        scrollIntoView: function (scrollTop) {
            var that = this;
            (0, utils_1.getRect)(this, '.van-index-anchor-wrapper').then(function (rect) {
                uni.pageScrollTo({
                    duration: 0,
                    scrollTop: scrollTop + rect.top - that.parent.data.stickyOffsetTop
                });
            });
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-index-anchor {
    background-color: var(--index-anchor-background-color, transparent);
    color: var(--index-anchor-text-color, #323233);
    font-size: var(--index-anchor-font-size, 14px);
    font-weight: var(--index-anchor-font-weight, 500);
    line-height: var(--index-anchor-line-height, 32px);
    padding: var(--index-anchor-padding, 0 16px);
}
.van-index-anchor--active {
    background-color: var(--index-anchor-active-background-color, #fff);
    color: var(--index-anchor-active-text-color, #07c160);
    left: 0;
    right: 0;
}
</style>
