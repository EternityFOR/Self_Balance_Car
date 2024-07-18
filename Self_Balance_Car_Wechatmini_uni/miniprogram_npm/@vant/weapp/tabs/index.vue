<template>
    <view :class="'custom-class ' + utils.bem('tabs', [type])">
        <van-sticky :disabled="!sticky" :z-index="zIndex" :offset-top="offsetTop" :container="container" @scroll="onTouchScroll">
            <view :class="utils.bem('tabs__wrap', { scrollable }) + ' ' + (type === 'line' && border ? 'van-hairline--top-bottom' : '') + ' wrap-class'">
                <slot name="nav-left" />

                <scroll-view
                    :scroll-x="scrollable"
                    :scroll-with-animation="scrollWithAnimation"
                    :scroll-left="scrollLeft"
                    :class="utils.bem('tabs__scroll', [type])"
                    :style="color ? 'border-color: ' + color : ''"
                >
                    <view :class="utils.bem('tabs__nav', [type, { complete: !ellipsis }]) + ' nav-class'" :style="computed.navStyle(color, type)">
                        <view
                            v-if="type === 'line'"
                            class="van-tabs__line"
                            :style="computed.lineStyle({ color, lineOffsetLeft, lineHeight, skipTransition, duration, lineWidth, inited })"
                        />
                        <view
                            :data-index="index"
                            :class="
                                computed.tabClass(index === currentIndex, ellipsis) +
                                ' ' +
                                utils.bem('tab', { active: index === currentIndex, disabled: item.disabled, complete: !ellipsis })
                            "
                            :style="
                                computed.tabStyle({
                                    active: index === currentIndex,
                                    ellipsis,
                                    color,
                                    type,
                                    disabled: item.disabled,
                                    titleActiveColor,
                                    titleInactiveColor,
                                    swipeThreshold,
                                    scrollable
                                })
                            "
                            @tap="onTap"
                            v-for="(item, index) in tabs"
                            :key="index"
                        >
                            <view :class="ellipsis ? 'van-ellipsis' : ''" :style="item.titleStyle">
                                {{ item.title }}
                                <van-info v-if="item.info !== null || item.dot" :info="item.info" :dot="item.dot" custom-class="van-tab__title__info" />
                            </view>
                        </view>
                    </view>
                </scroll-view>

                <slot name="nav-right" />
            </view>
        </van-sticky>

        <view class="van-tabs__content" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" @touchcancel="onTouchEnd">
            <view :class="utils.bem('tabs__track', [{ animated }]) + ' van-tabs__track'" :style="computed.trackStyle({ duration, currentIndex, animated })">
                <slot />
            </view>
        </view>
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/utils.wxs"></script>
<script module="computed" lang="wxs" src="@/miniprogram_npm/@vant/weapp/tabs/index.wxs"></script>
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
var touch_1 = require('../mixins/touch');
var utils_1 = require('../common/utils');
var validator_1 = require('../common/validator');
var relation_1 = require('../common/relation');
export default {
    data() {
        return {
            tabs: [],
            scrollLeft: 0,
            scrollable: false,
            currentIndex: 0,
            container: null,
            skipTransition: true,
            scrollWithAnimation: false,
            lineOffsetLeft: 0,
            inited: false
        };
    },
    mixins: [touch_1.touch],
    classes: ['nav-class', 'tab-class', 'tab-active-class', 'line-class', 'wrap-class'],
    relation: (0, relation_1.useChildren)('tab', function () {
        this.updateTabs();
    }),
    props: {
        sticky: Boolean,
        border: Boolean,
        swipeable: Boolean,
        titleActiveColor: String,
        titleInactiveColor: String,
        color: String,
        animated: {
            type: Boolean
        },
        lineWidth: {
            type: null,
            default: 40
        },
        lineHeight: {
            type: null,
            default: -1
        },
        active: {
            type: null,
            default: 0
        },
        type: {
            type: String,
            default: 'line'
        },
        ellipsis: {
            type: Boolean,
            default: true
        },
        duration: {
            type: Number,
            default: 0.3
        },
        zIndex: {
            type: Number,
            default: 1
        },
        swipeThreshold: {
            type: Number,
            default: 5
        },
        offsetTop: {
            type: Number,
            default: 0
        },
        lazyRender: {
            type: Boolean,
            default: true
        },
        useBeforeChange: {
            type: Boolean,
            default: false
        }
    },
    mounted: function () {
        var that = this;
        (0, utils_1.requestAnimationFrame)(function () {
            that.swiping = true;
            that.setData({
                container: function () {
                    return uni.createSelectorQuery().in(that).select('.van-tabs');
                }
            });
            that.resize();
            that.scrollIntoView();
        });
    },
    methods: {
        updateTabs: function () {
            var that = this;
            var _b = that.children;
            var children = _b === void 0 ? [] : _b;
            var data = that;
            this.setData({
                tabs: children.map(function (child) {
                    return child.data;
                }),
                scrollable: this.children.length > data.swipeThreshold || !data.ellipsis
            });
            this.setCurrentIndexByName(data.active || this.getCurrentName());
        },
        trigger: function (eventName, child) {
            var currentIndex = this.currentIndex;
            var data = this.getChildData(currentIndex, child);
            if (!(0, validator_1.isDef)(data)) {
                return;
            }
            this.$emit(eventName, data);
        },
        onTap: function (event) {
            var that = this;
            var index = event.currentTarget.dataset.index;
            var child = this.children[index];
            if (child.data.disabled) {
                this.trigger('disabled', child);
                return;
            }
            this.onBeforeChange(index).then(function () {
                that.setCurrentIndex(index);
                (0, utils_1.nextTick)(function () {
                    that.trigger('click');
                });
            });
        },
        // correct the index of active tab
        setCurrentIndexByName: function (name) {
            var _a = this.children;
            var children = _a === void 0 ? [] : _a;
            var matched = children.filter(function (child) {
                return child.getComputedName() === name;
            });
            if (matched.length) {
                this.setCurrentIndex(matched[0].index);
            }
        },
        setCurrentIndex: function (currentIndex) {
            var that = this;
            var _a = this;
            var data = _a;
            var _b = _a.children;
            var children = _b === void 0 ? [] : _b;
            if (!(0, validator_1.isDef)(currentIndex) || currentIndex >= children.length || currentIndex < 0) {
                return;
            }
            (0, utils_1.groupSetData)(this, function () {
                children.forEach(function (item, index) {
                    var active = index === currentIndex;
                    if (active !== item.data.active || !item.inited) {
                        item.updateRender(active, that);
                    }
                });
            });
            if (currentIndex === data.currentIndex) {
                return;
            }
            var shouldEmitChange = data.currentIndex !== null;
            this.setData({
                currentIndex: currentIndex
            });
            (0, utils_1.requestAnimationFrame)(function () {
                that.resize();
                that.scrollIntoView();
            });
            (0, utils_1.nextTick)(function () {
                that.trigger('input');
                if (shouldEmitChange) {
                    that.trigger('change');
                }
            });
        },
        getCurrentName: function () {
            var activeTab = this.children[this.currentIndex];
            if (activeTab) {
                return activeTab.getComputedName();
            }
        },
        resize: function () {
            var that = this;
            if (this.type !== 'line') {
                return;
            }
            var _a = this;
            var currentIndex = _a.currentIndex;
            var ellipsis = _a.ellipsis;
            var skipTransition = _a.skipTransition;
            Promise.all([(0, utils_1.getAllRect)(this, '.van-tab'), (0, utils_1.getRect)(this, '.van-tabs__line')]).then(function (_a) {
                var _b = _a[0];
                var rects = _b === void 0 ? [] : _b;
                var lineRect = _a[1];
                var rect = rects[currentIndex];
                if (rect == null) {
                    return;
                }
                var lineOffsetLeft = rects.slice(0, currentIndex).reduce(function (prev, curr) {
                    return prev + curr.width;
                }, 0);
                lineOffsetLeft += (rect.width - lineRect.width) / 2 + (ellipsis ? 0 : 8);
                that.setData({
                    lineOffsetLeft: lineOffsetLeft,
                    inited: true
                });
                that.swiping = true;
                if (skipTransition) {
                    // waiting transition end
                    setTimeout(function () {
                        that.setData({
                            skipTransition: false
                        });
                    }, that.duration);
                }
            });
        },
        // scroll active tab into view
        scrollIntoView: function () {
            var that = this;
            var _a = this;
            var currentIndex = _a.currentIndex;
            var scrollable = _a.scrollable;
            var scrollWithAnimation = _a.scrollWithAnimation;
            if (!scrollable) {
                return;
            }
            Promise.all([(0, utils_1.getAllRect)(this, '.van-tab'), (0, utils_1.getRect)(this, '.van-tabs__nav')]).then(function (_a) {
                var tabRects = _a[0];
                var navRect = _a[1];
                var tabRect = tabRects[currentIndex];
                var offsetLeft = tabRects.slice(0, currentIndex).reduce(function (prev, curr) {
                    return prev + curr.width;
                }, 0);
                that.setData({
                    scrollLeft: offsetLeft - (navRect.width - tabRect.width) / 2
                });
                if (!scrollWithAnimation) {
                    (0, utils_1.nextTick)(function () {
                        that.setData({
                            scrollWithAnimation: true
                        });
                    });
                }
            });
        },
        onTouchScroll: function (event) {
            this.$emit('scroll', event.detail);
        },
        onTouchStart: function (event) {
            if (!this.swipeable) {
                return;
            }
            this.swiping = true;
            this.touchStart(event);
        },
        onTouchMove: function (event) {
            if (!this.swipeable || !this.swiping) {
                return;
            }
            this.touchMove(event);
        },
        // watch swipe touch end
        onTouchEnd: function () {
            var that = this;
            if (!this.swipeable || !this.swiping) {
                return;
            }
            var _a = this;
            var direction = _a.direction;
            var deltaX = _a.deltaX;
            var offsetX = _a.offsetX;
            var minSwipeDistance = 50;
            if (direction === 'horizontal' && offsetX >= minSwipeDistance) {
                var index_1 = this.getAvaiableTab(deltaX);
                if (index_1 !== -1) {
                    this.onBeforeChange(index_1).then(function () {
                        return that.setCurrentIndex(index_1);
                    });
                }
            }
            this.swiping = false;
        },
        getAvaiableTab: function (direction) {
            var _a = this;
            var tabs = _a.tabs;
            var currentIndex = _a.currentIndex;
            var step = direction > 0 ? -1 : 1;
            for (var i = step; currentIndex + i < tabs.length && currentIndex + i >= 0; i += step) {
                var index = currentIndex + i;
                if (index >= 0 && index < tabs.length && tabs[index] && !tabs[index].disabled) {
                    return index;
                }
            }
            return -1;
        },
        onBeforeChange: function (index) {
            var that = this;
            var useBeforeChange = this.useBeforeChange;
            if (!useBeforeChange) {
                return Promise.resolve();
            }
            return new Promise(function (resolve, reject) {
                that.$emit(
                    'before-change',
                    __assign(__assign({}, that.getChildData(index)), {
                        callback: function (status) {
                            return status ? resolve() : reject();
                        }
                    })
                );
            });
        },
        getChildData: function (index, child) {
            var currentChild = child || this.children[index];
            if (!(0, validator_1.isDef)(currentChild)) {
                return;
            }
            return {
                index: currentChild.index,
                name: currentChild.getComputedName(),
                title: currentChild.data.title
            };
        }
    },
    watch: {
        animated: {
            handler: function () {
                var that = this;
                this.children.forEach(function (child, index) {
                    return child.updateRender(index === that.currentIndex, that);
                });
            },

            immediate: true
        },

        lineWidth: {
            handler: function () {
                var that = this;
                if (this.type !== 'line') {
                    return;
                }
                var _a = this;
                var currentIndex = _a.currentIndex;
                var ellipsis = _a.ellipsis;
                var skipTransition = _a.skipTransition;
                Promise.all([(0, utils_1.getAllRect)(this, '.van-tab'), (0, utils_1.getRect)(this, '.van-tabs__line')]).then(function (_a) {
                    var _b = _a[0];
                    var rects = _b === void 0 ? [] : _b;
                    var lineRect = _a[1];
                    var rect = rects[currentIndex];
                    if (rect == null) {
                        return;
                    }
                    var lineOffsetLeft = rects.slice(0, currentIndex).reduce(function (prev, curr) {
                        return prev + curr.width;
                    }, 0);
                    lineOffsetLeft += (rect.width - lineRect.width) / 2 + (ellipsis ? 0 : 8);
                    that.setData({
                        lineOffsetLeft: lineOffsetLeft,
                        inited: true
                    });
                    that.swiping = true;
                    if (skipTransition) {
                        // waiting transition end
                        setTimeout(function () {
                            that.setData({
                                skipTransition: false
                            });
                        }, that.duration);
                    }
                });
            },

            immediate: true
        },

        active: {
            handler: function (name) {
                if (name !== this.getCurrentName()) {
                    this.setCurrentIndexByName(name);
                }
            },

            immediate: true
        },

        swipeThreshold: {
            handler: function (value) {
                this.setData({
                    scrollable: this.children.length > value || !this.ellipsis
                });
            },

            immediate: true
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-tabs {
    -webkit-tap-highlight-color: transparent;
    position: relative;
}
.van-tabs__wrap {
    display: flex;
    overflow: hidden;
}
.van-tabs__wrap--scrollable .van-tab {
    flex: 0 0 22%;
}
.van-tabs__wrap--scrollable .van-tab--complete {
    flex: 1 0 auto !important;
    padding: 0 12px;
}
.van-tabs__wrap--scrollable .van-tabs__nav--complete {
    padding-left: 8px;
    padding-right: 8px;
}
.van-tabs__scroll {
    background-color: var(--tabs-nav-background-color, #fff);
}
.van-tabs__scroll--line {
    box-sizing: initial;
    height: calc(100% + 15px);
}
.van-tabs__scroll--card {
    border: 1px solid var(--tabs-default-color, #ee0a24);
    border-radius: 2px;
    box-sizing: border-box;
    margin: 0 var(--padding-md, 16px);
    width: calc(100% - var(--padding-md, 16px) * 2);
}
.van-tabs__scroll::-webkit-scrollbar {
    display: none;
}
.van-tabs__nav {
    display: flex;
    position: relative;
    -webkit-user-select: none;
    user-select: none;
}
.van-tabs__nav--card {
    box-sizing: border-box;
    height: var(--tabs-card-height, 30px);
}
.van-tabs__nav--card .van-tab {
    border-right: 1px solid var(--tabs-default-color, #ee0a24);
    color: var(--tabs-default-color, #ee0a24);
    line-height: calc(var(--tabs-card-height, 30px) - 2px);
}
.van-tabs__nav--card .van-tab:last-child {
    border-right: none;
}
.van-tabs__nav--card .van-tab.van-tab--active {
    background-color: var(--tabs-default-color, #ee0a24);
    color: #fff;
}
.van-tabs__nav--card .van-tab--disabled {
    color: var(--tab-disabled-text-color, #c8c9cc);
}
.van-tabs__line {
    background-color: var(--tabs-bottom-bar-color, #ee0a24);
    border-radius: var(--tabs-bottom-bar-height, 3px);
    bottom: 0;
    height: var(--tabs-bottom-bar-height, 3px);
    left: 0;
    opacity: 0;
    position: absolute;
    z-index: 1;
}
.van-tabs__track {
    height: 100%;
    position: relative;
    width: 100%;
}
.van-tabs__track--animated {
    display: flex;
    transition-property: left;
}
.van-tabs__content {
    overflow: hidden;
}
.van-tabs--line .van-tabs__wrap {
    height: var(--tabs-line-height, 44px);
}
.van-tabs--card .van-tabs__wrap {
    height: var(--tabs-card-height, 30px);
}
.van-tab {
    box-sizing: border-box;
    color: var(--tab-text-color, #646566);
    cursor: pointer;
    flex: 1;
    font-size: var(--tab-font-size, 14px);
    line-height: var(--tabs-line-height, 44px);
    min-width: 0;
    padding: 0 5px;
    position: relative;
    text-align: center;
}
.van-tab--active {
    color: var(--tab-active-text-color, #323233);
    font-weight: var(--font-weight-bold, 500);
}
.van-tab--disabled {
    color: var(--tab-disabled-text-color, #c8c9cc);
}
.van-tab__title__info {
    display: inline-block;
    position: relative !important;
    top: -1px !important;
    transform: translateX(0) !important;
}
</style>
