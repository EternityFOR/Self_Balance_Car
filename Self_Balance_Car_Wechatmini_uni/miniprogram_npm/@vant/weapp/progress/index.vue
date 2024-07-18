<template>
    <view class="van-progress custom-class" :style="computed.rootStyle({ strokeWidth, trackColor })">
        <view class="van-progress__portion" :style="computed.portionStyle({ percentage, inactive, color })">
            <view
                v-if="showPivot && computed.pivotText(pivotText, percentage)"
                :style="computed.pivotStyle({ textColor, pivotColor, inactive, color, right })"
                class="van-progress__pivot"
            >
                {{ computed.pivotText(pivotText, percentage) }}
            </view>
        </view>
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/utils.wxs"></script>
<script module="computed" lang="wxs" src="@/miniprogram_npm/@vant/weapp/progress/index.wxs"></script>
<script>
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var component_1 = require('../common/component');
var color_1 = require('../common/color');
var utils_1 = require('../common/utils');
export default {
    data() {
        return {
            right: 0
        };
    },
    props: {
        inactive: Boolean,
        percentage: {
            type: Number
        },
        pivotText: String,
        pivotColor: String,
        trackColor: String,
        showPivot: {
            type: Boolean,
            default: true
        },
        color: {
            type: String,
            default: color_1.BLUE
        },
        textColor: {
            type: String,
            default: '#fff'
        },
        strokeWidth: {
            type: null,
            default: 4
        }
    },
    mounted: function () {
        this.setLeft();
    },
    methods: {
        setLeft: function () {
            var that = this;
            Promise.all([(0, utils_1.getRect)(this, '.van-progress'), (0, utils_1.getRect)(this, '.van-progress__pivot')]).then(function (_a) {
                var portion = _a[0];
                var pivot = _a[1];
                if (portion && pivot) {
                    that.setData({
                        right: (pivot.width * (that.percentage - 100)) / 100
                    });
                }
            });
        }
    },
    watch: {
        percentage: {
            handler: function () {
                var that = this;
                Promise.all([(0, utils_1.getRect)(this, '.van-progress'), (0, utils_1.getRect)(this, '.van-progress__pivot')]).then(function (_a) {
                    var portion = _a[0];
                    var pivot = _a[1];
                    if (portion && pivot) {
                        that.setData({
                            right: (pivot.width * (that.percentage - 100)) / 100
                        });
                    }
                });
            },

            immediate: true
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-progress {
    background: var(--progress-background-color, #ebedf0);
    border-radius: var(--progress-height, 4px);
    height: var(--progress-height, 4px);
    position: relative;
}
.van-progress__portion {
    background: var(--progress-color, #1989fa);
    border-radius: inherit;
    height: 100%;
    left: 0;
    position: absolute;
}
.van-progress__pivot {
    background-color: var(--progress-pivot-background-color, #1989fa);
    border-radius: 1em;
    box-sizing: border-box;
    color: var(--progress-pivot-text-color, #fff);
    font-size: var(--progress-pivot-font-size, 10px);
    line-height: var(--progress-pivot-line-height, 1.6);
    min-width: 3.6em;
    padding: var(--progress-pivot-padding, 0 5px);
    position: absolute;
    text-align: center;
    top: 50%;
    transform: translateY(-50%);
    word-break: keep-all;
}
</style>
