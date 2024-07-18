<template>
    <view class="van-row custom-class" :style="computed.rootStyle({ gutterClone })">
        <slot />
    </view>
</template>
<script module="computed" lang="wxs" src="@/miniprogram_npm/@vant/weapp/row/index.wxs"></script>
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
            gutterClone: 0
        };
    },
    relation: (0, relation_1.useChildren)('col', function (target) {
        var gutter = this.gutter;
        if (gutter) {
            target.setData({
                gutterClone: gutter
            });
        }
    }),
    props: {
        gutter: {
            type: Number
        }
    },
    methods: {
        setGutter: function () {
            var that = this;
            this.children.forEach(function (col) {
                col.setData(that);
            });
        }
    },
    watch: {
        gutter: {
            handler: function () {
                this.gutterClone = this.clone(this.gutter);
                var that = this;
                this.children.forEach(function (col) {
                    col.setData(that);
                });
            },

            immediate: true
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-row:after {
    clear: both;
    content: '';
    display: table;
}
</style>
