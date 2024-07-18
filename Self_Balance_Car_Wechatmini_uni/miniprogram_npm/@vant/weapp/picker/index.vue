<template>
    <view class="van-picker custom-class">
        <!-- parse <include v-if="toolbarPosition === 'top'" src="./toolbar.wxml"/> -->
        <block v-if="toolbarPosition === 'top'">
            <view v-if="showToolbar" class="van-picker__toolbar toolbar-class">
                <view class="van-picker__cancel" hover-class="van-picker__cancel--hover" hover-stay-time="70" data-type="cancel" @tap="emit">
                    {{ cancelButtonText }}
                </view>
                <view v-if="title" class="van-picker__title van-ellipsis">{{ title }}</view>
                <view class="van-picker__confirm" hover-class="van-picker__confirm--hover" hover-stay-time="70" data-type="confirm" @tap="emit">
                    {{ confirmButtonText }}
                </view>
            </view>
        </block>

        <view v-if="loading" class="van-picker__loading">
            <loading color="#1989fa" />
        </view>

        <view class="van-picker__columns" :style="computed.columnsStyle({ itemHeight, visibleItemCount })" @touchmove.stop.prevent="noop">
            <picker-column
                class="van-picker__column"
                :data-index="index"
                custom-class="column-class"
                :value-key="valueKey"
                :initial-options="item.values"
                :default-index="item.defaultIndex || defaultIndex"
                :item-height="itemHeight"
                :visible-item-count="visibleItemCount"
                active-class="active-class"
                @change="onChange($event, { index })"
                v-for="(item, index) in computed.columns(columns)"
                :key="index"
            ></picker-column>
            <view class="van-picker__mask" :style="computed.maskStyle({ itemHeight, visibleItemCount })" />
            <view class="van-picker__frame van-hairline--top-bottom" :style="computed.frameStyle({ itemHeight })" />
        </view>

        <!-- parse <include v-if="toolbarPosition === 'bottom'" src="./toolbar.wxml"/> -->
        <block v-if="toolbarPosition === 'bottom'">
            <view v-if="showToolbar" class="van-picker__toolbar toolbar-class">
                <view class="van-picker__cancel" hover-class="van-picker__cancel--hover" hover-stay-time="70" data-type="cancel" @tap="emit">
                    {{ cancelButtonText }}
                </view>
                <view v-if="title" class="van-picker__title van-ellipsis">{{ title }}</view>
                <view class="van-picker__confirm" hover-class="van-picker__confirm--hover" hover-stay-time="70" data-type="confirm" @tap="emit">
                    {{ confirmButtonText }}
                </view>
            </view>
        </block>
    </view>
</template>
<script module="computed" lang="wxs" src="@/miniprogram_npm/@vant/weapp/picker/index.wxs"></script>
<script>
'use strict';
import pickerColumn from '../picker-column/index';
import loading from '../loading/index';
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
var shared_1 = require('./shared');
export default {
    components: {
        pickerColumn,
        loading
    },
    data() {
        return {
            toolbarPosition: '',
            showToolbar: '',
            cancelButtonText: '',
            title: '',
            confirmButtonText: '',
            loading: '',
            valueKey: '',
            defaultIndex: '',
            visibleItemCount: ''
        };
    },
    classes: ['active-class', 'toolbar-class', 'column-class'],
    props: __assign(__assign({}, shared_1.pickerProps), {
        valueKey: {
            type: String,
            value: 'text'
        },
        toolbarPosition: {
            type: String,
            value: 'top'
        },
        defaultIndex: {
            type: Number,
            value: 0
        },
        columns: {
            type: Array,
            value: [],
            observer: function (columns) {
                if (columns === void 0) {
                    columns = [];
                }
                this.simple = columns.length && !columns[0].values;
                if (Array.isArray(this.children) && this.children.length) {
                    this.setColumns().catch(function () {});
                }
            }
        }
    }),
    beforeCreate: function () {
        var that = this;
        Object.defineProperty(this, 'children', {
            get: function () {
                return that.zpSelectAllComponents('.van-picker__column') || [];
            }
        });
    },
    methods: {
        noop: function () {},
        setColumns: function () {
            var that = this;
            var data = this;
            var columns = this.simple
                ? [
                      {
                          values: data.columns
                      }
                  ]
                : data.columns;
            var stack = columns.map(function (column, index) {
                return that.setColumnValues(index, column.values);
            });
            return Promise.all(stack);
        },
        emit: function (event) {
            var type = event.currentTarget.dataset.type;
            if (this.simple) {
                this.$emit(type, {
                    value: this.getColumnValue(0),
                    index: this.getColumnIndex(0)
                });
            } else {
                this.$emit(type, {
                    value: this.getValues(),
                    index: this.getIndexes()
                });
            }
        },
        onChange: function (event, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(event, _dataset);
            /* ---处理dataset end--- */
            if (this.simple) {
                this.$emit('change', {
                    picker: this,
                    value: this.getColumnValue(0),
                    index: this.getColumnIndex(0)
                });
            } else {
                this.$emit('change', {
                    picker: this,
                    value: this.getValues(),
                    index: event.currentTarget.dataset.index
                });
            }
        },
        // get column instance by index
        getColumn: function (index) {
            return this.children[index];
        },
        // get column value by index
        getColumnValue: function (index) {
            var column = this.getColumn(index);
            return column && column.getValue();
        },
        // set column value by index
        setColumnValue: function (index, value) {
            var column = this.getColumn(index);
            if (column == null) {
                return Promise.reject(new Error('setColumnValue: 对应列不存在'));
            }
            return column.setValue(value);
        },
        // get column option index by column index
        getColumnIndex: function (columnIndex) {
            return (this.getColumn(columnIndex) || {}).data.currentIndex;
        },
        // set column option index by column index
        setColumnIndex: function (columnIndex, optionIndex) {
            var column = this.getColumn(columnIndex);
            if (column == null) {
                return Promise.reject(new Error('setColumnIndex: 对应列不存在'));
            }
            return column.setIndex(optionIndex);
        },
        // get options of column by index
        getColumnValues: function (index) {
            return (this.children[index] || {}).data.options;
        },
        // set options of column by index
        setColumnValues: function (index, options, needReset) {
            if (needReset === void 0) {
                needReset = true;
            }
            var column = this.children[index];
            if (column == null) {
                return Promise.reject(new Error('setColumnValues: 对应列不存在'));
            }
            var isSame = JSON.stringify(column.data.options) === JSON.stringify(options);
            if (isSame) {
                return Promise.resolve();
            }
            return column
                .set({
                    options: options
                })
                .then(function () {
                    if (needReset) {
                        column.setIndex(0);
                    }
                });
        },
        // get values of all columns
        getValues: function () {
            return this.children.map(function (child) {
                return child.getValue();
            });
        },
        // set values of all columns
        setValues: function (values) {
            var that = this;
            var stack = values.map(function (value, index) {
                return that.setColumnValue(index, value);
            });
            return Promise.all(stack);
        },
        // get indexes of all columns
        getIndexes: function () {
            return this.children.map(function (child) {
                return child.data.currentIndex;
            });
        },
        // set indexes of all columns
        setIndexes: function (indexes) {
            var that = this;
            var stack = indexes.map(function (optionIndex, columnIndex) {
                return that.setColumnIndex(columnIndex, optionIndex);
            });
            return Promise.all(stack);
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-picker {
    -webkit-text-size-adjust: 100%;
    background-color: var(--picker-background-color, #fff);
    overflow: hidden;
    position: relative;
    -webkit-user-select: none;
    user-select: none;
}
.van-picker__toolbar {
    display: flex;
    height: var(--picker-toolbar-height, 44px);
    justify-content: space-between;
    line-height: var(--picker-toolbar-height, 44px);
}
.van-picker__cancel,
.van-picker__confirm {
    font-size: var(--picker-action-font-size, 14px);
    padding: var(--picker-action-padding, 0 16px);
}
.van-picker__cancel--hover,
.van-picker__confirm--hover {
    opacity: 0.7;
}
.van-picker__confirm {
    color: var(--picker-confirm-action-color, #576b95);
}
.van-picker__cancel {
    color: var(--picker-cancel-action-color, #969799);
}
.van-picker__title {
    font-size: var(--picker-option-font-size, 16px);
    font-weight: var(--font-weight-bold, 500);
    max-width: 50%;
    text-align: center;
}
.van-picker__columns {
    display: flex;
    position: relative;
}
.van-picker__column {
    flex: 1 1;
    width: 0;
}
.van-picker__loading {
    align-items: center;
    background-color: var(--picker-loading-mask-color, hsla(0, 0%, 100%, 0.9));
    bottom: 0;
    display: flex;
    justify-content: center;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 4;
}
.van-picker__mask {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    background-image: linear-gradient(180deg, hsla(0, 0%, 100%, 0.9), hsla(0, 0%, 100%, 0.4)), linear-gradient(0deg, hsla(0, 0%, 100%, 0.9), hsla(0, 0%, 100%, 0.4));
    background-position: top, bottom;
    background-repeat: no-repeat;
    height: 100%;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 2;
}
.van-picker__frame,
.van-picker__mask {
    pointer-events: none;
    position: absolute;
}
.van-picker__frame {
    left: 16px;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
}
</style>
