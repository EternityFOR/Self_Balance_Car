<template>
    <view :class="utils.bem('stepper', [theme]) + ' custom-class'">
        <view
            v-if="showMinus"
            data-type="minus"
            :style="computed.buttonStyle({ buttonSize })"
            :class="'minus-class ' + utils.bem('stepper__minus', { disabled: disabled || disableMinus || currentValue <= min })"
            hover-class="van-stepper__minus--hover"
            hover-stay-time="70"
            @tap="onTap"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"
        >
            <slot name="minus" />
        </view>
        <input
            :always-embed="alwaysEmbed"
            :type="integer ? 'number' : 'digit'"
            :class="'input-class ' + utils.bem('stepper__input', { disabled: disabled || disableInput })"
            :style="computed.inputStyle({ buttonSize, inputWidth })"
            :value="currentValue"
            :focus="focus"
            :disabled="disabled || disableInput"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
        />
        <view
            v-if="showPlus"
            data-type="plus"
            :style="computed.buttonStyle({ buttonSize })"
            :class="'plus-class ' + utils.bem('stepper__plus', { disabled: disabled || disablePlus || currentValue >= max })"
            hover-class="van-stepper__plus--hover"
            hover-stay-time="70"
            @tap="onTap"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"
        >
            <slot name="plus" />
        </view>
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/utils.wxs"></script>
<script module="computed" lang="wxs" src="@/miniprogram_npm/@vant/weapp/stepper/index.wxs"></script>
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
var validator_1 = require('../common/validator');
var LONG_PRESS_START_TIME = 600;
var LONG_PRESS_INTERVAL = 200;
// add num and avoid float number
function add(num1, num2) {
    var cardinal = Math.pow(10, 10);
    return Math.round((num1 + num2) * cardinal) / cardinal;
}
function equal(value1, value2) {
    return String(value1) === String(value2);
}
export default {
    data() {
        return {
            currentValue: '',
            focus: ''
        };
    },
    field: true,
    classes: ['input-class', 'plus-class', 'minus-class'],
    props: {
        value: {
            type: null
        },
        integer: {
            type: Boolean
        },
        disabled: Boolean,
        inputWidth: String,
        buttonSize: String,
        asyncChange: Boolean,
        disableInput: Boolean,
        decimalLength: {
            type: Number,
            default: null
        },
        min: {
            type: null,
            default: 1
        },
        max: {
            type: null,
            default: Number.MAX_SAFE_INTEGER
        },
        step: {
            type: null,
            default: 1
        },
        showPlus: {
            type: Boolean,
            default: true
        },
        showMinus: {
            type: Boolean,
            default: true
        },
        disablePlus: Boolean,
        disableMinus: Boolean,
        longPress: {
            type: Boolean,
            default: true
        },
        theme: String,
        alwaysEmbed: Boolean
    },
    watch: {
        value: function () {
            this.observeValue();
        },

        integer: {
            handler: function () {
                var val = this.format(this.currentValue);
                if (!equal(val, this.currentValue)) {
                    this.setData({
                        currentValue: val
                    });
                }
            },

            immediate: true
        },

        decimalLength: {
            handler: function () {
                var val = this.format(this.currentValue);
                if (!equal(val, this.currentValue)) {
                    this.setData({
                        currentValue: val
                    });
                }
            },

            immediate: true
        },

        min: {
            handler: function () {
                var val = this.format(this.currentValue);
                if (!equal(val, this.currentValue)) {
                    this.setData({
                        currentValue: val
                    });
                }
            },

            immediate: true
        },

        max: {
            handler: function () {
                var val = this.format(this.currentValue);
                if (!equal(val, this.currentValue)) {
                    this.setData({
                        currentValue: val
                    });
                }
            },

            immediate: true
        }
    },
    created: function () {
        this.setData({
            currentValue: this.format(this.value)
        });
    },
    methods: {
        observeValue: function () {
            var value = this.value;
            this.setData({
                currentValue: this.format(value)
            });
        },
        check: function () {
            var val = this.format(this.currentValue);
            if (!equal(val, this.currentValue)) {
                this.setData({
                    currentValue: val
                });
            }
        },
        isDisabled: function (type) {
            var _a = this;
            var disabled = _a.disabled;
            var disablePlus = _a.disablePlus;
            var disableMinus = _a.disableMinus;
            var currentValue = _a.currentValue;
            var max = _a.max;
            var min = _a.min;
            if (type === 'plus') {
                return disabled || disablePlus || currentValue >= max;
            }
            return disabled || disableMinus || currentValue <= min;
        },
        onFocus: function (event) {
            this.$emit('focus', event.detail);
        },
        onBlur: function (event) {
            var value = this.format(event.detail.value);
            this.setData({
                currentValue: value
            });
            this.$emit(
                'blur',
                __assign(__assign({}, event.detail), {
                    value: value
                })
            );
        },
        // filter illegal characters
        filter: function (value) {
            value = String(value).replace(/[^0-9.-]/g, '');
            if (this.integer && value.indexOf('.') !== -1) {
                value = value.split('.')[0];
            }
            return value;
        },
        // limit value range
        format: function (value) {
            value = this.filter(value);
            // format range
            value = value === '' ? 0 : +value;
            value = Math.max(Math.min(this.max, value), this.min);
            // format decimal
            if ((0, validator_1.isDef)(this.decimalLength)) {
                value = value.toFixed(this.decimalLength);
            }
            return value;
        },
        onInput: function (event) {
            var _a = (event.detail || {}).value;
            var value = _a === void 0 ? '' : _a; // allow input to be empty
            if (value === '') {
                return;
            }
            var formatted = this.filter(value);
            // limit max decimal length
            if ((0, validator_1.isDef)(this.decimalLength) && formatted.indexOf('.') !== -1) {
                var pair = formatted.split('.');
                formatted = ''.concat(pair[0], '.').concat(pair[1].slice(0, this.decimalLength));
            }
            this.emitChange(formatted);
        },
        emitChange: function (value) {
            if (!this.asyncChange) {
                this.setData({
                    currentValue: value
                });
            }
            this.$emit('change', value);
        },
        onChange: function () {
            var type = this.type;
            if (this.isDisabled(type)) {
                this.$emit('overlimit', type);
                return;
            }
            var diff = type === 'minus' ? -this.step : +this.step;
            var value = this.format(add(+this.currentValue, diff));
            this.emitChange(value);
            this.$emit(type);
        },
        longPressStep: function () {
            var that = this;
            this.longPressTimer = setTimeout(function () {
                that.onChange();
                that.longPressStep();
            }, LONG_PRESS_INTERVAL);
        },
        onTap: function (event) {
            var type = event.currentTarget.dataset.type;
            this.type = type;
            this.onChange();
        },
        onTouchStart: function (event) {
            var that = this;
            if (!this.longPress) {
                return;
            }
            clearTimeout(this.longPressTimer);
            var type = event.currentTarget.dataset.type;
            this.type = type;
            this.isLongPress = false;
            this.longPressTimer = setTimeout(function () {
                that.isLongPress = true;
                that.onChange();
                that.longPressStep();
            }, LONG_PRESS_START_TIME);
        },
        onTouchEnd: function () {
            if (!this.longPress) {
                return;
            }
            clearTimeout(this.longPressTimer);
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-stepper {
    font-size: 0;
}
.van-stepper__minus,
.van-stepper__plus {
    background-color: var(--stepper-background-color, #f2f3f5);
    border: 0;
    box-sizing: border-box;
    color: var(--stepper-button-icon-color, #323233);
    display: inline-block;
    height: var(--stepper-input-height, 28px);
    margin: 1px;
    padding: var(--padding-base, 4px);
    position: relative;
    vertical-align: middle;
    width: var(--stepper-input-height, 28px);
}
.van-stepper__minus:before,
.van-stepper__plus:before {
    height: 1px;
    width: 9px;
}
.van-stepper__minus:after,
.van-stepper__plus:after {
    height: 9px;
    width: 1px;
}
.van-stepper__minus:empty.van-stepper__minus:after,
.van-stepper__minus:empty.van-stepper__minus:before,
.van-stepper__minus:empty.van-stepper__plus:after,
.van-stepper__minus:empty.van-stepper__plus:before,
.van-stepper__plus:empty.van-stepper__minus:after,
.van-stepper__plus:empty.van-stepper__minus:before,
.van-stepper__plus:empty.van-stepper__plus:after,
.van-stepper__plus:empty.van-stepper__plus:before {
    background-color: currentColor;
    bottom: 0;
    content: '';
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    top: 0;
}
.van-stepper__minus--hover,
.van-stepper__plus--hover {
    background-color: var(--stepper-active-color, #e8e8e8);
}
.van-stepper__minus--disabled,
.van-stepper__plus--disabled {
    color: var(--stepper-button-disabled-icon-color, #c8c9cc);
}
.van-stepper__minus--disabled,
.van-stepper__minus--disabled.van-stepper__minus--hover,
.van-stepper__minus--disabled.van-stepper__plus--hover,
.van-stepper__plus--disabled,
.van-stepper__plus--disabled.van-stepper__minus--hover,
.van-stepper__plus--disabled.van-stepper__plus--hover {
    background-color: var(--stepper-button-disabled-color, #f7f8fa);
}
.van-stepper__minus {
    border-radius: var(--stepper-border-radius, var(--stepper-border-radius, 4px)) 0 0 var(--stepper-border-radius, var(--stepper-border-radius, 4px));
}
.van-stepper__minus:after {
    display: none;
}
.van-stepper__plus {
    border-radius: 0 var(--stepper-border-radius, var(--stepper-border-radius, 4px)) var(--stepper-border-radius, var(--stepper-border-radius, 4px)) 0;
}
.van-stepper--round .van-stepper__input {
    background-color: initial !important;
}
.van-stepper--round .van-stepper__minus,
.van-stepper--round .van-stepper__plus {
    border-radius: 100%;
}
.van-stepper--round .van-stepper__minus:active,
.van-stepper--round .van-stepper__plus:active {
    opacity: 0.7;
}
.van-stepper--round .van-stepper__minus--disabled,
.van-stepper--round .van-stepper__minus--disabled:active,
.van-stepper--round .van-stepper__plus--disabled,
.van-stepper--round .van-stepper__plus--disabled:active {
    opacity: 0.3;
}
.van-stepper--round .van-stepper__plus {
    background-color: #ee0a24;
    color: #fff;
}
.van-stepper--round .van-stepper__minus {
    background-color: #fff;
    border: 1px solid #ee0a24;
    color: #ee0a24;
}
.van-stepper__input {
    -webkit-appearance: none;
    background-color: var(--stepper-background-color, #f2f3f5);
    border: 0;
    border-radius: 0;
    border-width: 1px 0;
    box-sizing: border-box;
    color: var(--stepper-input-text-color, #323233);
    display: inline-block;
    font-size: var(--stepper-input-font-size, 14px);
    height: var(--stepper-input-height, 28px);
    margin: 1px;
    min-height: 0;
    padding: 1px;
    text-align: center;
    vertical-align: middle;
    width: var(--stepper-input-width, 32px);
}
.van-stepper__input--disabled {
    background-color: var(--stepper-input-disabled-background-color, #f2f3f5);
    color: var(--stepper-input-disabled-text-color, #c8c9cc);
}
</style>
