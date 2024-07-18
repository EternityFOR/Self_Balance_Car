<template>
    <view>
        <view v-if="showHeader" class="van-cascader__header">
            <text class="van-cascader__title">
                <slot name="title"></slot>
                {{ title }}
            </text>
            <van-icon v-if="closeable" :name="closeIcon" class="van-cascader__close-icon" @tap.native="onClose" />
        </view>

        <van-tabs
            :active="activeTab"
            custom-class="van-cascader__tabs"
            wrap-class="van-cascader__tabs-wrap"
            tab-class="van-cascader__tab"
            :color="activeColor"
            :border="false"
            :swipeable="swipeable"
            @click="onClickTab"
        >
            <van-tab
                :title="tab.selected ? tab.selected[textKey] : placeholder"
                style="width: 100%"
                :title-style="!tab.selected ? 'color: #969799;font-weight:normal;' : ''"
                v-for="(tab, tabIndex) in tabs"
                :key="tabIndex"
            >
                <!-- 暂不支持 -->

                <!-- <slot name="options-top"></slot> -->

                <view class="van-cascader__options">
                    <view
                        :class="option.className + ' ' + utils.optionClass(tab, textKey, option)"
                        :style="utils.optionStyle({ tab, textKey, option, activeColor })"
                        :data-option="option"
                        :data-tab-index="tabIndex"
                        @tap="onSelect"
                        v-for="(option, index) in tab.options"
                        :key="index"
                    >
                        <text>{{ option[textKey] }}</text>

                        <van-icon v-if="utils.isSelected(tab, textKey, option)" name="success" size="18" />
                    </view>
                </view>

                <!-- 暂不支持 -->

                <!-- <slot name="options-bottom"></slot> -->
            </van-tab>
        </van-tabs>
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/cascader/index.wxs"></script>
<script>
'use strict';
var __spreadArray =
    (this && this.__spreadArray) ||
    function (to, from, pack) {
        if (pack || arguments.length === 2) {
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar) {
                        ar = Array.prototype.slice.call(from, 0, i);
                    }
                    ar[i] = from[i];
                }
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
Object.defineProperty(exports, '__esModule', {
    value: true
});
var component_1 = require('../common/component');
var FieldName;
(function (FieldName) {
    FieldName['TEXT'] = 'text';
    FieldName['VALUE'] = 'value';
    FieldName['CHILDREN'] = 'children';
})(FieldName || (FieldName = {}));
var defaultFieldNames = {
    text: FieldName.TEXT,
    value: FieldName.VALUE,
    children: FieldName.CHILDREN
};
export default {
    data() {
        return {
            tabs: [],
            activeTab: 0,
            textKey: FieldName.TEXT,
            valueKey: FieldName.VALUE,
            childrenKey: FieldName.CHILDREN,

            tab: {
                selected: false,
                options: []
            },

            tabIndex: 0,

            option: {
                className: ''
            }
        };
    },
    props: {
        title: String,
        value: {
            type: String
        },
        placeholder: {
            type: String,
            default: '请选择'
        },
        activeColor: {
            type: String,
            default: '#1989fa'
        },
        options: {
            type: Array,
            default: () => []
        },
        swipeable: {
            type: Boolean,
            default: false
        },
        closeable: {
            type: Boolean,
            default: true
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        closeIcon: {
            type: String,
            default: 'cross'
        },
        fieldNames: {
            type: Object,
            default: defaultFieldNames
        }
    },
    created: function () {
        this.updateTabs();
    },
    methods: {
        updateOptions: function (val, oldVal) {
            var isAsync = !!(val.length && oldVal.length);
            this.updateTabs(isAsync);
        },
        updateValue: function (val) {
            var that = this;
            if (val !== undefined) {
                var values = this.tabs.map(function (tab) {
                    return tab.selected && tab.selected[that.valueKey];
                });
                if (values.indexOf(val) > -1) {
                    return;
                }
            }
            this.updateTabs();
        },
        updateFieldNames: function () {
            var _a = this.fieldNames || defaultFieldNames;
            var _b = _a.text;
            var text = _b === void 0 ? 'text' : _b;
            var _c = _a.value;
            var value = _c === void 0 ? 'value' : _c;
            var _d = _a.children;
            var children = _d === void 0 ? 'children' : _d;
            this.setData({
                textKey: text,
                valueKey: value,
                childrenKey: children
            });
        },
        getSelectedOptionsByValue: function (options, value) {
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                if (option[this.valueKey] === value) {
                    return [option];
                }
                if (option[this.childrenKey]) {
                    var selectedOptions = this.getSelectedOptionsByValue(option[this.childrenKey], value);
                    if (selectedOptions) {
                        return __spreadArray([option], selectedOptions, true);
                    }
                }
            }
        },
        updateTabs: function (isAsync) {
            var that = this;
            if (isAsync === void 0) {
                isAsync = false;
            }
            var _a = this;
            var options = _a.options;
            var value = _a.value;
            if (value !== undefined) {
                var selectedOptions = this.getSelectedOptionsByValue(options, value);
                if (selectedOptions) {
                    var optionsCursor_1 = options;
                    var tabs_1 = selectedOptions.map(function (option) {
                        var tab = {
                            options: optionsCursor_1,
                            selected: option
                        };
                        var next = optionsCursor_1.find(function (item) {
                            return item[that.valueKey] === option[that.valueKey];
                        });
                        if (next) {
                            optionsCursor_1 = next[that.childrenKey];
                        }
                        return tab;
                    });
                    if (optionsCursor_1) {
                        tabs_1.push({
                            options: optionsCursor_1,
                            selected: null
                        });
                    }
                    this.setData({
                        tabs: tabs_1
                    });
                    this.$nextTick(function () {
                        that.setData({
                            activeTab: tabs_1.length - 1
                        });
                    });
                    return;
                }
            }
            // 异步更新
            if (isAsync) {
                var tabs = this.tabs;
                tabs[tabs.length - 1].options = options[options.length - 1][this.childrenKey];
                this.setData({
                    tabs: tabs
                });
                return;
            }
            this.setData({
                tabs: [
                    {
                        options: options,
                        selected: null
                    }
                ]
            });
        },
        onClose: function () {
            this.$emit('close');
        },
        onClickTab: function (e) {
            var _a = e.detail;
            var tabIndex = _a.index;
            var title = _a.title;
            this.$emit('click-tab', {
                title: title,
                tabIndex: tabIndex
            });
        },
        // 选中
        onSelect: function (e) {
            var that = this;
            var _a = e.currentTarget.dataset;
            var option = _a.option;
            var tabIndex = _a.tabIndex;
            if (option && option.disabled) {
                return;
            }
            var _b = this;
            var valueKey = _b.valueKey;
            var childrenKey = _b.childrenKey;
            var tabs = this.tabs;
            tabs[tabIndex].selected = option;
            if (tabs.length > tabIndex + 1) {
                tabs = tabs.slice(0, tabIndex + 1);
            }
            if (option[childrenKey]) {
                var nextTab = {
                    options: option[childrenKey],
                    selected: null
                };
                if (tabs[tabIndex + 1]) {
                    tabs[tabIndex + 1] = nextTab;
                } else {
                    tabs.push(nextTab);
                }
                this.$nextTick(function () {
                    that.setData({
                        activeTab: tabIndex + 1
                    });
                });
            }
            this.setData({
                tabs: tabs
            });
            var selectedOptions = tabs
                .map(function (tab) {
                    return tab.selected;
                })
                .filter(Boolean);
            var params = {
                value: option[valueKey],
                tabIndex: tabIndex,
                selectedOptions: selectedOptions
            };
            this.$emit('change', params);
            if (!option[childrenKey]) {
                this.$emit('finish', params);
            }
        }
    },
    watch: {
        value: {
            handler: function (val) {
                var that = this;
                if (val !== undefined) {
                    var values = this.tabs.map(function (tab) {
                        return tab.selected && tab.selected[that.valueKey];
                    });
                    if (values.indexOf(val) > -1) {
                        return;
                    }
                }
                this.updateTabs();
            },

            immediate: true
        },

        options: {
            handler: function (val, oldVal) {
                var isAsync = !!(val.length && oldVal.length);
                this.updateTabs(isAsync);
            },

            immediate: true,
            deep: true
        },

        fieldNames: {
            handler: function () {
                var _a = this.fieldNames || defaultFieldNames;
                var _b = _a.text;
                var text = _b === void 0 ? 'text' : _b;
                var _c = _a.value;
                var value = _c === void 0 ? 'value' : _c;
                var _d = _a.children;
                var children = _d === void 0 ? 'children' : _d;
                this.setData({
                    textKey: text,
                    valueKey: value,
                    childrenKey: children
                });
            },

            immediate: true,
            deep: true
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-cascader__header {
    align-items: center;
    display: flex;
    height: 48px;
    justify-content: space-between;
    padding: 0 16px;
}
.van-cascader__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
}
.van-cascader__close-icon {
    color: #c8c9cc;
    font-size: 22px;
    height: 22px;
}
.van-cascader__tabs-wrap {
    height: 48px !important;
    padding: 0 8px;
}
.van-cascader__tab {
    color: #323233 !important;
    flex: none !important;
    font-weight: 600 !important;
    padding: 0 8px !important;
}
.van-cascader__tab--unselected {
    color: #969799 !important;
    font-weight: 400 !important;
}
.van-cascader__option {
    align-items: center;
    cursor: pointer;
    display: flex;
    font-size: 14px;
    justify-content: space-between;
    line-height: 20px;
    padding: 10px 16px;
}
.van-cascader__option:active {
    background-color: #f2f3f5;
}
.van-cascader__option--selected {
    color: #1989fa;
    font-weight: 600;
}
.van-cascader__option--disabled {
    color: #c8c9cc;
    cursor: not-allowed;
}
.van-cascader__option--disabled:active {
    background-color: initial;
}
.van-cascader__options {
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    height: 384px;
    overflow-y: auto;
    padding-top: 6px;
}
</style>
