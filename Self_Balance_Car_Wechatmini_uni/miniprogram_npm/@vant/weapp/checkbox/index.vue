<template>
    <view :class="utils.bem('checkbox', [{ horizontal: direction === 'horizontal' }]) + ' custom-class'">
        <view v-if="labelPosition === 'left'" :class="'label-class ' + utils.bem('checkbox__label', [labelPosition, { disabled: disabled || parentDisabled }])" @tap="onClickLabel">
            <slot />
        </view>
        <view class="van-checkbox__icon-wrap" @tap="toggle">
            <slot v-if="useIconSlot" name="icon" />
            <van-icon
                v-else
                name="success"
                size="0.8em"
                :class="utils.bem('checkbox__icon', [shape, { disabled: disabled || parentDisabled, checked: value }])"
                :style="computed.iconStyle(checkedColor, value, disabled, parentDisabled, iconSize)"
                custom-class="icon-class"
                custom-style="line-height: 1.25em;"
            />
        </view>
        <view
            v-if="labelPosition === 'right'"
            :class="'label-class ' + utils.bem('checkbox__label', [labelPosition, { disabled: disabled || parentDisabled }])"
            @tap="onClickLabel"
        >
            <slot />
        </view>
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/utils.wxs"></script>
<script module="computed" lang="wxs" src="@/miniprogram_npm/@vant/weapp/checkbox/index.wxs"></script>
<script>
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var relation_1 = require('../common/relation');
var component_1 = require('../common/component');
function emit(target, value) {
    target.$emit('input', value);
    target.$emit('change', value);
}
export default {
    data() {
        return {
            parentDisabled: false,
            direction: 'vertical'
        };
    },
    field: true,
    relation: (0, relation_1.useParent)('checkbox-group'),
    classes: ['icon-class', 'label-class'],
    props: {
        value: Boolean,
        disabled: Boolean,
        useIconSlot: Boolean,
        checkedColor: String,
        labelPosition: {
            type: String,
            default: 'right'
        },
        labelDisabled: Boolean,
        shape: {
            type: String,
            default: 'round'
        },
        iconSize: {
            type: null,
            default: 20
        }
    },
    methods: {
        emitChange: function (value) {
            if (this.parent) {
                this.setParentValue(this.parent, value);
            } else {
                emit(this, value);
            }
        },
        toggle: function () {
            var _a = this;
            var parentDisabled = _a.parentDisabled;
            var disabled = _a.disabled;
            var value = _a.value;
            if (!disabled && !parentDisabled) {
                this.emitChange(!value);
            }
        },
        onClickLabel: function () {
            var _a = this;
            var labelDisabled = _a.labelDisabled;
            var parentDisabled = _a.parentDisabled;
            var disabled = _a.disabled;
            var value = _a.value;
            if (!disabled && !labelDisabled && !parentDisabled) {
                this.emitChange(!value);
            }
        },
        setParentValue: function (parent, value) {
            var parentValue = parent.data.value.slice();
            var name = this.name;
            var max = parent.data.max;
            if (value) {
                if (max && parentValue.length >= max) {
                    return;
                }
                if (parentValue.indexOf(name) === -1) {
                    parentValue.push(name);
                    emit(parent, parentValue);
                }
            } else {
                var index = parentValue.indexOf(name);
                if (index !== -1) {
                    parentValue.splice(index, 1);
                    emit(parent, parentValue);
                }
            }
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-checkbox {
    align-items: center;
    display: flex;
    overflow: hidden;
    -webkit-user-select: none;
    user-select: none;
}
.van-checkbox--horizontal {
    margin-right: 12px;
}
.van-checkbox__icon-wrap,
.van-checkbox__label {
    line-height: var(--checkbox-size, 20px);
}
.van-checkbox__icon-wrap {
    flex: none;
}
.van-checkbox__icon {
    align-items: center;
    border: 1px solid var(--checkbox-border-color, #c8c9cc);
    box-sizing: border-box;
    color: transparent;
    display: flex;
    font-size: var(--checkbox-size, 20px);
    height: 1em;
    justify-content: center;
    text-align: center;
    transition-duration: var(--checkbox-transition-duration, 0.2s);
    transition-property: color, border-color, background-color;
    width: 1em;
}
.van-checkbox__icon--round {
    border-radius: 100%;
}
.van-checkbox__icon--checked {
    background-color: var(--checkbox-checked-icon-color, #1989fa);
    border-color: var(--checkbox-checked-icon-color, #1989fa);
    color: #fff;
}
.van-checkbox__icon--disabled {
    background-color: var(--checkbox-disabled-background-color, #ebedf0);
    border-color: var(--checkbox-disabled-icon-color, #c8c9cc);
}
.van-checkbox__icon--disabled.van-checkbox__icon--checked {
    color: var(--checkbox-disabled-icon-color, #c8c9cc);
}
.van-checkbox__label {
    word-wrap: break-word;
    color: var(--checkbox-label-color, #323233);
    padding-left: var(--checkbox-label-margin, 10px);
}
.van-checkbox__label--left {
    float: left;
    margin: 0 var(--checkbox-label-margin, 10px) 0 0;
}
.van-checkbox__label--disabled {
    color: var(--checkbox-disabled-label-color, #c8c9cc);
}
.van-checkbox__label:empty {
    margin: 0;
}
</style>
