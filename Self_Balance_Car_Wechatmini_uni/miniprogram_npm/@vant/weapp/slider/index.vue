<template>
    <view :class="'custom-class ' + utils.bem('slider', { disabled, vertical })" :style="wrapperStyle" @tap="onClick">
        <view :class="utils.bem('slider__bar')" :style="barStyle + '; ' + style({ backgroundColor: activeColor })">
            <view
                v-if="range"
                :class="utils.bem('slider__button-wrapper-left')"
                :data-index="0"
                @touchstart="onTouchStart"
                @touchmove.stop.prevent="onTouchMove"
                @touchend="onTouchEnd"
                @touchcancel="onTouchEnd"
            >
                <slot v-if="useButtonSlot" name="left-button" />
                <view v-else :class="utils.bem('slider__button')" />
            </view>
            <view
                v-if="range"
                :class="utils.bem('slider__button-wrapper-right')"
                :data-index="1"
                @touchstart="onTouchStart"
                @touchmove.stop.prevent="onTouchMove"
                @touchend="onTouchEnd"
                @touchcancel="onTouchEnd"
            >
                <slot v-if="useButtonSlot" name="right-button" />
                <view v-else :class="utils.bem('slider__button')" />
            </view>

            <view
                v-if="!range"
                :class="utils.bem('slider__button-wrapper')"
                @touchstart="onTouchStart"
                @touchmove.stop.prevent="onTouchMove"
                @touchend="onTouchEnd"
                @touchcancel="onTouchEnd"
            >
                <slot v-if="useButtonSlot" name="button" />
                <view v-else :class="utils.bem('slider__button')" />
            </view>
        </view>
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/utils.wxs"></script>
<script module="style" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/style.wxs"></script>
<script>
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var component_1 = require('../common/component');
var touch_1 = require('../mixins/touch');
var version_1 = require('../common/version');
var utils_1 = require('../common/utils');
var DRAG_STATUS = {
    START: 'start',
    MOVING: 'moving',
    END: 'end'
};
export default {
    data() {
        return {
            wrapperStyle: '',
            barStyle: '',
            valueClone: ''
        };
    },
    mixins: [touch_1.touch],
    props: {
        range: Boolean,
        disabled: Boolean,
        useButtonSlot: Boolean,
        activeColor: String,
        inactiveColor: String,
        max: {
            type: Number,
            default: 100
        },
        min: {
            type: Number,
            default: 0
        },
        step: {
            type: Number,
            default: 1
        },
        value: {
            type: null,
            default: 0
        },
        vertical: Boolean,
        barHeight: null
    },
    created: function () {
        this.updateValue(this.value);
    },
    methods: {
        onTouchStart: function (event) {
            var that = this;
            if (this.disabled) {
                return;
            }
            var index = event.currentTarget.dataset.index;
            if (typeof index === 'number') {
                this.buttonIndex = index;
            }
            this.touchStart(event);
            this.startValue = this.format(this.value);
            this.newValue = this.value;
            if (this.isRange(this.newValue)) {
                this.startValue = this.newValue.map(function (val) {
                    return that.format(val);
                });
            } else {
                this.startValue = this.format(this.newValue);
            }
            this.dragStatus = DRAG_STATUS.START;
        },
        onTouchMove: function (event) {
            var that = this;
            if (this.disabled) {
                return;
            }
            if (this.dragStatus === DRAG_STATUS.START) {
                this.$emit('drag-start');
            }
            this.touchMove(event);
            this.dragStatus = DRAG_STATUS.MOVING;
            (0, utils_1.getRect)(this, '.van-slider').then(function (rect) {
                var vertical = that.vertical;
                var delta = vertical ? that.deltaY : that.deltaX;
                var total = vertical ? rect.height : rect.width;
                var diff = (delta / total) * that.getRange();
                if (that.isRange(that.startValue)) {
                    that.newValue[that.buttonIndex] = that.startValue[that.buttonIndex] + diff;
                } else {
                    that.newValue = that.startValue + diff;
                }
                that.updateValue(that.newValue, false, true);
            });
        },
        onTouchEnd: function () {
            var that = this;
            if (this.disabled) {
                return;
            }
            if (this.dragStatus === DRAG_STATUS.MOVING) {
                this.dragStatus = DRAG_STATUS.END;
                (0, utils_1.nextTick)(function () {
                    that.updateValue(that.newValue, true);
                    that.$emit('drag-end');
                });
            }
        },
        onClick: function (event) {
            var that = this;
            if (this.disabled) {
                return;
            }
            var min = this.min;
            (0, utils_1.getRect)(this, '.van-slider').then(function (rect) {
                var vertical = that.vertical;
                var touch = event.touches[0];
                var delta = vertical ? touch.clientY - rect.top : touch.clientX - rect.left;
                var total = vertical ? rect.height : rect.width;
                var value = Number(min) + (delta / total) * that.getRange();
                if (that.isRange(that.value)) {
                    var _a = that.clone(value);
                    var left = _a[0];
                    var right = _a[1];
                    var middle = (left + right) / 2;
                    if (value <= middle) {
                        that.updateValue([value, right], true);
                    } else {
                        that.updateValue([left, value], true);
                    }
                } else {
                    that.updateValue(value, true);
                }
            });
        },
        isRange: function (val) {
            var range = this.range;
            return range && Array.isArray(val);
        },
        handleOverlap: function (value) {
            if (value[0] > value[1]) {
                return value.slice(0).reverse();
            }
            return value;
        },
        updateValue: function (value, end, drag) {
            var that = this;
            if (this.isRange(value)) {
                value = this.handleOverlap(value).map(function (val) {
                    return that.format(val);
                });
            } else {
                value = this.format(value);
            }
            this.value = value;
            var vertical = this.vertical;
            var mainAxis = vertical ? 'height' : 'width';
            this.setData({
                wrapperStyle: '\n          background: '
                    .concat(this.inactiveColor || '', ';\n          ')
                    .concat(vertical ? 'width' : 'height', ': ')
                    .concat((0, utils_1.addUnit)(this.barHeight) || '', ';\n        '),
                barStyle: '\n          '
                    .concat(mainAxis, ': ')
                    .concat(this.calcMainAxis(), ';\n          left: ')
                    .concat(vertical ? 0 : this.calcOffset(), ';\n          top: ')
                    .concat(vertical ? this.calcOffset() : 0, ';\n          ')
                    .concat(drag ? 'transition: none;' : '', '\n        ')
            });
            if (drag) {
                this.$emit('drag', {
                    value: value
                });
            }
            if (end) {
                this.$emit('change', value);
            }
            if ((drag || end) && (0, version_1.canIUseModel)()) {
                this.setData({
                    valueClone: value
                });
            }
        },
        getScope: function () {
            return Number(this.max) - Number(this.min);
        },
        getRange: function () {
            var _a = this;
            var max = _a.max;
            var min = _a.min;
            return max - min;
        },
        getOffsetWidth: function (current, min) {
            var scope = this.getScope();
            // 避免最小值小于最小step时出现负数情况
            return ''.concat(Math.max(((current - min) * 100) / scope, 0), '%');
        },
        // 计算选中条的长度百分比
        calcMainAxis: function () {
            var value = this.clone(newVal);
            var min = this.min;
            if (this.isRange(value)) {
                return this.getOffsetWidth(value[1], value[0]);
            }
            return this.getOffsetWidth(value, Number(min));
        },
        // 计算选中条的开始位置的偏移量
        calcOffset: function () {
            var value = this.clone(newVal);
            var min = this.min;
            var scope = this.getScope();
            if (this.isRange(value)) {
                return ''.concat(((value[0] - Number(min)) * 100) / scope, '%');
            }
            return '0%';
        },
        format: function (value) {
            var _a = this;
            var max = _a.max;
            var min = _a.min;
            var step = _a.step;
            return Math.round(Math.max(min, Math.min(value, max)) / step) * step;
        }
    },
    watch: {
        value: {
            handler: function (val) {
                this.valueClone = this.clone(this.value);
                if (val !== this.value) {
                    this.updateValue(val);
                }
            },

            immediate: true
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-slider {
    background-color: var(--slider-inactive-background-color, #ebedf0);
    border-radius: 999px;
    height: var(--slider-bar-height, 2px);
    position: relative;
}
.van-slider:before {
    bottom: calc(var(--padding-xs, 8px) * -1);
    content: '';
    left: 0;
    position: absolute;
    right: 0;
    top: calc(var(--padding-xs, 8px) * -1);
}
.van-slider__bar {
    background-color: var(--slider-active-background-color, #1989fa);
    border-radius: inherit;
    height: 100%;
    position: relative;
    transition: all 0.2s;
    width: 100%;
}
.van-slider__button {
    background-color: var(--slider-button-background-color, #fff);
    border-radius: var(--slider-button-border-radius, 50%);
    box-shadow: var(--slider-button-box-shadow, 0 1px 2px rgba(0, 0, 0, 0.5));
    height: var(--slider-button-height, 24px);
    width: var(--slider-button-width, 24px);
}
.van-slider__button-wrapper,
.van-slider__button-wrapper-right {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate3d(50%, -50%, 0);
}
.van-slider__button-wrapper-left {
    left: 0;
    position: absolute;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
}
.van-slider--disabled {
    opacity: var(--slider-disabled-opacity, 0.5);
}
.van-slider--vertical {
    display: inline-block;
    height: 100%;
    width: var(--slider-bar-height, 2px);
}
.van-slider--vertical .van-slider__button-wrapper,
.van-slider--vertical .van-slider__button-wrapper-right {
    bottom: 0;
    right: 50%;
    top: auto;
    transform: translate3d(50%, 50%, 0);
}
.van-slider--vertical .van-slider__button-wrapper-left {
    left: auto;
    right: 50%;
    top: 0;
    transform: translate3d(50%, -50%, 0);
}
.van-slider--vertical:before {
    bottom: 0;
    left: -8px;
    right: -8px;
    top: 0;
}
</style>
