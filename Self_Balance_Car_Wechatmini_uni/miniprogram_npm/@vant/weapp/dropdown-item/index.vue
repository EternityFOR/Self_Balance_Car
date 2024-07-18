<template>
    <view v-if="showWrapper" :class="utils.bem('dropdown-item', direction) + ' custom-class'" :style="wrapperStyle">
        <van-popup
            :show="showPopup"
            :custom-style="'position: absolute;' + popupStyle"
            overlay-style="position: absolute;"
            :overlay="overlay"
            :position="direction === 'down' ? 'top' : 'bottom'"
            :duration="transition ? duration : 0"
            :close-on-click-overlay="closeOnClickOverlay"
            @enter="onOpen"
            @leave="onClose"
            @close="toggle"
            @after-enter="onOpened"
            @after-leave="onClosed"
        >
            <van-cell
                :data-option="item"
                :class="utils.bem('dropdown-item__option', { active: item.value === valueClone })"
                clickable
                :icon="item.icon"
                @tap.native="onOptionTap($event, { option: item })"
                v-for="(item, index) in options"
                :key="index"
            >
                <view slot="title" class="van-dropdown-item__title item-title-class" :style="item.value === valueClone ? 'color:' + activeColor : ''">
                    {{ item.text }}
                </view>

                <van-icon v-if="item.value === valueClone" name="success" class="van-dropdown-item__icon" :color="activeColor" />
            </van-cell>

            <slot />
        </van-popup>
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/utils.wxs"></script>
<script>
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var relation_1 = require('../common/relation');
var component_1 = require('../common/component');
export default {
    data() {
        return {
            transition: true,
            showPopup: false,
            showWrapper: false,
            displayTitle: '',
            overlay: '',
            duration: '',
            activeColor: '',
            closeOnClickOverlay: '',
            direction: '',
            wrapperStyle: '',
            valueClone: ''
        };
    },
    classes: ['item-title-class'],
    field: true,
    relation: (0, relation_1.useParent)('dropdown-menu', function () {
        this.updateDataFromParent();
    }),
    props: {
        value: {
            type: null
        },
        title: {
            type: String
        },
        disabled: Boolean,
        titleClass: {
            type: String
        },
        options: {
            type: Array,
            default: () => []
        },
        popupStyle: String,
        useBeforeToggle: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        rerender: function () {
            this.valueClone = this.clone(this.value);
            var that = this;
            this.$nextTick(function () {
                var _a;
                if ((_a = that.parent) === null || _a === void 0) {
                    void 0;
                } else {
                    _a.updateItemListData();
                }
            });
        },
        updateDataFromParent: function () {
            if (this.parent) {
                var _a = this.parent.data;
                var overlay = _a.overlay;
                var duration = _a.duration;
                var activeColor = _a.activeColor;
                var closeOnClickOverlay = _a.closeOnClickOverlay;
                var direction = _a.direction;
                this.setData({
                    overlay: overlay,
                    duration: duration,
                    activeColor: activeColor,
                    closeOnClickOverlay: closeOnClickOverlay,
                    direction: direction
                });
            }
        },
        onOpen: function () {
            this.$emit('open');
        },
        onOpened: function () {
            this.$emit('opened');
        },
        onClose: function () {
            this.$emit('close');
        },
        onClosed: function () {
            this.$emit('closed');
            this.setData({
                showWrapper: false
            });
        },
        onOptionTap: function (event, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(event, _dataset);
            /* ---处理dataset end--- */
            var option = event.currentTarget.dataset.option;
            var value = option.value;
            var shouldEmitChange = this.value !== value;
            this.setData({
                showPopup: false,
                valueClone: value
            });
            this.$emit('close');
            this.rerender();
            if (shouldEmitChange) {
                this.$emit('change', value);
            }
        },
        toggle: function (show, options) {
            var that = this;
            if (options === void 0) {
                options = {};
            }
            var showPopup = this.showPopup;
            if (typeof show !== 'boolean') {
                show = !showPopup;
            }
            if (show === showPopup) {
                return;
            }
            this.onBeforeToggle(show).then(function (status) {
                var _a;
                if (!status) {
                    return;
                }
                that.setData({
                    transition: !options.immediate,
                    showPopup: show
                });
                if (show) {
                    if ((_a = that.parent) === null || _a === void 0) {
                        void 0;
                    } else {
                        _a.getChildWrapperStyle().then(function (wrapperStyle) {
                            that.setData({
                                wrapperStyle: wrapperStyle,
                                showWrapper: true
                            });
                            that.rerender();
                        });
                    }
                } else {
                    that.rerender();
                }
            });
        },
        onBeforeToggle: function (status) {
            var that = this;
            var useBeforeToggle = this.useBeforeToggle;
            if (!useBeforeToggle) {
                return Promise.resolve(true);
            }
            return new Promise(function (resolve) {
                that.$emit('before-toggle', {
                    status: status,
                    callback: function (value) {
                        return resolve(value);
                    }
                });
            });
        }
    },
    watch: {
        value: {
            handler: function () {
                this.valueClone = this.clone(this.value);
                var that = this;
                this.$nextTick(function () {
                    var _a;
                    if ((_a = that.parent) === null || _a === void 0) {
                        void 0;
                    } else {
                        _a.updateItemListData();
                    }
                });
            },

            immediate: true
        },

        title: {
            handler: function () {
                this.valueClone = this.clone(this.value);
                var that = this;
                this.$nextTick(function () {
                    var _a;
                    if ((_a = that.parent) === null || _a === void 0) {
                        void 0;
                    } else {
                        _a.updateItemListData();
                    }
                });
            },

            immediate: true
        },

        titleClass: {
            handler: function () {
                this.valueClone = this.clone(this.value);
                var that = this;
                this.$nextTick(function () {
                    var _a;
                    if ((_a = that.parent) === null || _a === void 0) {
                        void 0;
                    } else {
                        _a.updateItemListData();
                    }
                });
            },

            immediate: true
        },

        options: {
            handler: function () {
                this.valueClone = this.clone(this.value);
                var that = this;
                this.$nextTick(function () {
                    var _a;
                    if ((_a = that.parent) === null || _a === void 0) {
                        void 0;
                    } else {
                        _a.updateItemListData();
                    }
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
.van-dropdown-item {
    left: 0;
    overflow: hidden;
    position: fixed;
    right: 0;
}
.van-dropdown-item__option {
    text-align: left;
}
.van-dropdown-item__option--active .van-dropdown-item__icon,
.van-dropdown-item__option--active .van-dropdown-item__title {
    color: var(--dropdown-menu-option-active-color, #ee0a24);
}
.van-dropdown-item--up {
    top: 0;
}
.van-dropdown-item--down {
    bottom: 0;
}
.van-dropdown-item__icon {
    display: block;
    line-height: inherit;
}
</style>
