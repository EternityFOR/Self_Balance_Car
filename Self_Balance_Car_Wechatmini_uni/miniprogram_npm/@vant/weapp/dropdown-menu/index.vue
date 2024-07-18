<template>
    <view class="van-dropdown-menu van-dropdown-menu--top-bottom custom-class">
        <view :data-index="index" :class="utils.bem('dropdown-menu__item', { disabled: item.disabled })" @tap="onTitleTap" v-for="(item, index) in itemListData" :key="index">
            <view
                :class="item.titleClass + ' ' + utils.bem('dropdown-menu__title', { active: item.showPopup, down: item.showPopup === (direction === 'down') }) + ' title-class'"
                :style="item.showPopup ? 'color:' + activeColor : ''"
            >
                <view class="van-ellipsis">
                    {{ computed.displayTitle(item) }}
                </view>
            </view>
        </view>

        <slot />
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/utils.wxs"></script>
<script module="computed" lang="wxs" src="@/miniprogram_npm/@vant/weapp/dropdown-menu/index.wxs"></script>
<script>
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var component_1 = require('../common/component');
var relation_1 = require('../common/relation');
var utils_1 = require('../common/utils');
var ARRAY = [];
export default {
    data() {
        return {
            itemListData: []
        };
    },
    field: true,
    classes: ['title-class'],
    relation: (0, relation_1.useChildren)('dropdown-item', function () {
        this.updateItemListData();
    }),
    props: {
        activeColor: {
            type: String
        },
        overlay: {
            type: Boolean,
            default: true
        },
        zIndex: {
            type: Number,
            default: 10
        },
        duration: {
            type: Number,
            default: 200
        },
        direction: {
            type: String,
            default: 'down'
        },
        closeOnClickOverlay: {
            type: Boolean,
            default: true
        },
        closeOnClickOutside: {
            type: Boolean,
            default: true
        }
    },
    beforeCreate: function () {
        var windowHeight = (0, utils_1.getSystemInfoSync)().windowHeight;
        this.windowHeight = windowHeight;
        ARRAY.push(this);
    },
    destroyed: function () {
        var that = this;
        ARRAY = ARRAY.filter(function (item) {
            return item !== that;
        });
    },
    methods: {
        updateItemListData: function () {
            this.setData({
                itemListData: this.children.map(function (child) {
                    return child.data;
                })
            });
        },
        updateChildrenData: function () {
            this.children.forEach(function (child) {
                child.updateDataFromParent();
            });
        },
        toggleItem: function (active) {
            this.children.forEach(function (item, index) {
                var showPopup = item.data.showPopup;
                if (index === active) {
                    item.toggle();
                } else if (showPopup) {
                    item.toggle(false, {
                        immediate: true
                    });
                }
            });
        },
        close: function () {
            this.children.forEach(function (child) {
                child.toggle(false, {
                    immediate: true
                });
            });
        },
        getChildWrapperStyle: function () {
            var that = this;
            var _a = this;
            var zIndex = _a.zIndex;
            var direction = _a.direction;
            return (0, utils_1.getRect)(this, '.van-dropdown-menu').then(function (rect) {
                var _a = rect.top;
                var top = _a === void 0 ? 0 : _a;
                var _b = rect.bottom;
                var bottom = _b === void 0 ? 0 : _b;
                var offset = direction === 'down' ? bottom : that.windowHeight - top;
                var wrapperStyle = 'z-index: '.concat(zIndex, ';');
                if (direction === 'down') {
                    wrapperStyle += 'top: '.concat((0, utils_1.addUnit)(offset), ';');
                } else {
                    wrapperStyle += 'bottom: '.concat((0, utils_1.addUnit)(offset), ';');
                }
                return wrapperStyle;
            });
        },
        onTitleTap: function (event) {
            var that = this;
            var index = event.currentTarget.dataset.index;
            var child = this.children[index];
            if (!child.data.disabled) {
                ARRAY.forEach(function (menuItem) {
                    if (menuItem && menuItem.data.closeOnClickOutside && menuItem !== that) {
                        menuItem.close();
                    }
                });
                this.toggleItem(index);
            }
        }
    },
    watch: {
        activeColor: {
            handler: function () {
                this.children.forEach(function (child) {
                    child.updateDataFromParent();
                });
            },

            immediate: true
        },

        overlay: {
            handler: function () {
                this.children.forEach(function (child) {
                    child.updateDataFromParent();
                });
            },

            immediate: true
        },

        duration: {
            handler: function () {
                this.children.forEach(function (child) {
                    child.updateDataFromParent();
                });
            },

            immediate: true
        },

        direction: {
            handler: function () {
                this.children.forEach(function (child) {
                    child.updateDataFromParent();
                });
            },

            immediate: true
        },

        closeOnClickOverlay: {
            handler: function () {
                this.children.forEach(function (child) {
                    child.updateDataFromParent();
                });
            },

            immediate: true
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-dropdown-menu {
    background-color: var(--dropdown-menu-background-color, #fff);
    box-shadow: var(--dropdown-menu-box-shadow, 0 2px 12px hsla(210, 1%, 40%, 0.12));
    display: flex;
    height: var(--dropdown-menu-height, 50px);
    -webkit-user-select: none;
    user-select: none;
}
.van-dropdown-menu__item {
    align-items: center;
    display: flex;
    flex: 1;
    justify-content: center;
    min-width: 0;
}
.van-dropdown-menu__item:active {
    opacity: 0.7;
}
.van-dropdown-menu__item--disabled:active {
    opacity: 1;
}
.van-dropdown-menu__item--disabled .van-dropdown-menu__title {
    color: var(--dropdown-menu-title-disabled-text-color, #969799);
}
.van-dropdown-menu__title {
    box-sizing: border-box;
    color: var(--dropdown-menu-title-text-color, #323233);
    font-size: var(--dropdown-menu-title-font-size, 15px);
    line-height: var(--dropdown-menu-title-line-height, 18px);
    max-width: 100%;
    padding: var(--dropdown-menu-title-padding, 0 24px 0 8px);
    position: relative;
}
.van-dropdown-menu__title:after {
    border-color: transparent transparent currentcolor currentcolor;
    border-style: solid;
    border-width: 3px;
    content: '';
    margin-top: -5px;
    opacity: 0.8;
    position: absolute;
    right: 11px;
    top: 50%;
    transform: rotate(-45deg);
}
.van-dropdown-menu__title--active {
    color: var(--dropdown-menu-title-active-text-color, #ee0a24);
}
.van-dropdown-menu__title--down:after {
    margin-top: -1px;
    transform: rotate(135deg);
}
</style>
