<template>
    <view :class="'custom-class ' + utils.bem('goods-action', { safe: safeAreaInsetBottom })">
        <slot />
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
        return {};
    },
    relation: (0, relation_1.useChildren)('goods-action-button', function () {
        this.children.forEach(function (item) {
            item.updateStyle();
        });
    }),
    props: {
        safeAreaInsetBottom: {
            type: Boolean,
            default: true
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-goods-action {
    align-items: center;
    background-color: var(--goods-action-background-color, #fff);
    bottom: 0;
    box-sizing: initial;
    display: flex;
    height: var(--goods-action-height, 50px);
    left: 0;
    position: fixed;
    right: 0;
}
.van-goods-action--safe {
    padding-bottom: env(safe-area-inset-bottom);
}
</style>
