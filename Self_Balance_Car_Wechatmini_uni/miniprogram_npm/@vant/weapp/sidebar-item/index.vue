<template>
    <view
        :class="utils.bem('sidebar-item', { selected, disabled }) + ' ' + (selected ? 'active-class' : '') + ' ' + (disabled ? 'disabled-class' : '') + ' custom-class'"
        hover-class="van-sidebar-item--hover"
        hover-stay-time="70"
        @tap="onClick"
    >
        <view class="van-sidebar-item__text">
            <van-info v-if="badge != null || info !== null || dot" :dot="dot" :info="badge != null ? badge : info" />
            <view v-if="title">{{ title }}</view>
            <slot v-else name="title" />
        </view>
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/utils.wxs"></script>
<script>
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var component_1 = require('../common/component');
var relation_1 = require('../common/relation');
export default {
    data() {
        return {
            selected: ''
        };
    },
    classes: ['active-class', 'disabled-class'],
    relation: (0, relation_1.useParent)('sidebar'),
    props: {
        dot: Boolean,
        badge: null,
        info: null,
        title: String,
        disabled: Boolean
    },
    methods: {
        onClick: function () {
            var that = this;
            var parent = this.parent;
            if (!parent || this.disabled) {
                return;
            }
            var index = parent.children.indexOf(this);
            parent.setActive(index).then(function () {
                that.$emit('click', index);
                parent.$emit('change', index);
            });
        },
        setActive: function (selected) {
            return this.setData({
                selected: selected
            });
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-sidebar-item {
    background-color: var(--sidebar-background-color, #f7f8fa);
    border-left: 3px solid transparent;
    box-sizing: border-box;
    color: var(--sidebar-text-color, #323233);
    display: block;
    font-size: var(--sidebar-font-size, 14px);
    line-height: var(--sidebar-line-height, 20px);
    overflow: hidden;
    padding: var(--sidebar-padding, 20px 12px 20px 8px);
    -webkit-user-select: none;
    user-select: none;
}
.van-sidebar-item__text {
    display: inline-block;
    position: relative;
    word-break: break-all;
}
.van-sidebar-item--hover:not(.van-sidebar-item--disabled) {
    background-color: var(--sidebar-active-color, #f2f3f5);
}
.van-sidebar-item:after {
    border-bottom-width: 1px;
}
.van-sidebar-item--selected {
    border-color: var(--sidebar-selected-border-color, #ee0a24);
    color: var(--sidebar-selected-text-color, #323233);
    font-weight: var(--sidebar-selected-font-weight, 500);
}
.van-sidebar-item--selected:after {
    border-right-width: 1px;
}
.van-sidebar-item--selected,
.van-sidebar-item--selected.van-sidebar-item--hover {
    background-color: var(--sidebar-selected-background-color, #fff);
}
.van-sidebar-item--disabled {
    color: var(--sidebar-disabled-text-color, #c8c9cc);
}
</style>
