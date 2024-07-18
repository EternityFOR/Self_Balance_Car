<template>
    <view :class="'van-collapse-item custom-class ' + (index !== 0 ? 'van-hairline--top' : '')">
        <van-cell
            :size="size"
            :title="title"
            title-class="title-class"
            :icon="icon"
            :value="value"
            :label="label"
            :is-link="isLink"
            :clickable="clickable"
            :border="border && expanded"
            :class="utils.bem('collapse-item__title', { disabled, expanded })"
            right-icon-class="van-cell__right-icon"
            custom-class="van-cell"
            hover-class="van-cell--hover"
            @click="onClick"
        >
            <slot name="title" slot="title" />
            <slot name="icon" slot="icon" />
            <slot name="value" />
            <slot name="right-icon" slot="right-icon" />
        </van-cell>
        <view :class="utils.bem('collapse-item__wrapper')" style="height: 0" :animation="animation">
            <view class="van-collapse-item__content content-class">
                <slot />
            </view>
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
var animate_1 = require('./animate');
export default {
    data() {
        return {
            expanded: false,
            animation: ''
        };
    },
    classes: ['title-class', 'content-class'],
    relation: (0, relation_1.useParent)('collapse'),
    props: {
        size: String,
        name: null,
        title: null,
        value: null,
        icon: String,
        label: String,
        disabled: Boolean,
        clickable: Boolean,
        border: {
            type: Boolean,
            default: true
        },
        isLink: {
            type: Boolean,
            default: true
        }
    },
    mounted: function () {
        this.updateExpanded();
        this.mounted = true;
    },
    methods: {
        updateExpanded: function () {
            if (!this.parent) {
                return;
            }
            var _a = this.parent.data;
            var value = _a.value;
            var accordion = _a.accordion;
            var _b = this.parent.children;
            var children = _b === void 0 ? [] : _b;
            var name = this.name;
            var index = children.indexOf(this);
            var currentName = name == null ? index : name;
            var expanded = accordion
                ? value === currentName
                : (value || []).some(function (name) {
                      return name === currentName;
                  });
            if (expanded !== this.expanded) {
                (0, animate_1.setContentAnimate)(this, expanded, this.mounted);
            }
            this.setData({
                index: index,
                expanded: expanded
            });
        },
        onClick: function () {
            if (this.disabled) {
                return;
            }
            var _a = this;
            var name = _a.name;
            var expanded = _a.expanded;
            var index = this.parent.children.indexOf(this);
            var currentName = name == null ? index : name;
            this.parent.switch(currentName, !expanded);
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-collapse-item__title .van-cell__right-icon {
    transform: rotate(90deg);
    transition: transform var(--collapse-item-transition-duration, 0.3s);
}
.van-collapse-item__title--expanded .van-cell__right-icon {
    transform: rotate(-90deg);
}
.van-collapse-item__title--disabled .van-cell,
.van-collapse-item__title--disabled .van-cell__right-icon {
    color: var(--collapse-item-title-disabled-color, #c8c9cc) !important;
}
.van-collapse-item__title--disabled .van-cell--hover {
    background-color: #fff !important;
}
.van-collapse-item__wrapper {
    overflow: hidden;
}
.van-collapse-item__content {
    background-color: var(--collapse-item-content-background-color, #fff);
    color: var(--collapse-item-content-text-color, #969799);
    font-size: var(--collapse-item-content-font-size, 13px);
    line-height: var(--collapse-item-content-line-height, 1.5);
    padding: var(--collapse-item-content-padding, 15px);
}
</style>
