<template>
    <view>
        <van-popup
            :show="show"
            position="bottom"
            :round="round"
            :z-index="zIndex"
            :overlay="overlay"
            custom-class="van-action-sheet custom-class"
            :safe-area-inset-bottom="safeAreaInsetBottom"
            :close-on-click-overlay="closeOnClickOverlay"
            @close="onClickOverlay"
        >
            <view v-if="title" class="van-action-sheet__header">
                {{ title }}
                <van-icon name="cross" custom-class="van-action-sheet__close" @click="onClose" />
            </view>
            <view v-if="description" class="van-action-sheet__description van-hairline--bottom">
                {{ description }}
            </view>
            <view v-if="actions && actions.length" class="list-class">
                <!-- button外包一层view，防止actions动态变化，导致渲染时button被打散 -->
                <button
                    :open-type="item.disabled || item.loading || (canIUseGetUserProfile && item.openType === 'getUserInfo') ? '' : item.openType"
                    :style="item.color ? 'color: ' + item.color : ''"
                    :class="utils.bem('action-sheet__item', { disabled: item.disabled || item.loading }) + ' ' + (item.className || '')"
                    hover-class="van-action-sheet__item--hover"
                    :data-index="index"
                    @tap="parseEventDynamicCode($event, item.disabled || item.loading ? '' : 'onSelect')"
                    @getuserinfo="onGetUserInfo"
                    @contact="onContact"
                    @getphonenumber="onGetPhoneNumber"
                    @error="onError"
                    @launchapp="onLaunchApp"
                    @opensetting="onOpenSetting"
                    :lang="lang"
                    :session-from="sessionFrom"
                    :send-message-title="sendMessageTitle"
                    :send-message-path="sendMessagePath"
                    :send-message-img="sendMessageImg"
                    :show-message-card="showMessageCard"
                    :app-parameter="appParameter"
                    v-for="(item, index) in actions"
                    :key="index"
                >
                    <block v-if="!item.loading">
                        {{ item.name }}
                        <view v-if="item.subname" class="van-action-sheet__subname">{{ item.subname }}</view>
                    </block>

                    <van-loading v-else custom-class="van-action-sheet__loading" size="22px" />
                </button>
            </view>
            <slot />
            <block v-if="cancelText">
                <view class="van-action-sheet__gap" />
                <view class="van-action-sheet__cancel" hover-class="van-action-sheet__cancel--hover" hover-stay-time="70" @tap="onCancel">
                    {{ cancelText }}
                </view>
            </block>
        </van-popup>
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/utils.wxs"></script>
<script>
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var component_1 = require('../common/component');
var button_1 = require('../mixins/button');
export default {
    data() {
        return {
            canIUseGetUserProfile: '',
            lang: '',
            sessionFrom: '',
            sendMessageTitle: '',
            sendMessagePath: '',
            sendMessageImg: '',
            showMessageCard: '',
            appParameter: ''
        };
    },
    classes: ['list-class'],
    mixins: [button_1.button],
    props: {
        show: Boolean,
        title: String,
        cancelText: String,
        description: String,
        round: {
            type: Boolean,
            default: true
        },
        zIndex: {
            type: Number,
            default: 100
        },
        actions: {
            type: Array,
            default: () => []
        },
        overlay: {
            type: Boolean,
            default: true
        },
        closeOnClickOverlay: {
            type: Boolean,
            default: true
        },
        closeOnClickAction: {
            type: Boolean,
            default: true
        },
        safeAreaInsetBottom: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        onSelect: function (event) {
            var that = this;
            var index = event.currentTarget.dataset.index;
            var _a = this;
            var actions = _a.actions;
            var closeOnClickAction = _a.closeOnClickAction;
            var canIUseGetUserProfile = _a.canIUseGetUserProfile;
            var item = actions[index];
            if (item) {
                this.$emit('select', item);
                if (closeOnClickAction) {
                    this.onClose();
                }
                if (item.openType === 'getUserInfo' && canIUseGetUserProfile) {
                    uni.getUserProfile({
                        desc: item.getUserProfileDesc || '  ',
                        complete: function (userProfile) {
                            that.$emit('getuserinfo', userProfile);
                        }
                    });
                }
            }
        },

        onCancel: function () {
            this.$emit('cancel');
        },

        onClose: function () {
            this.$emit('close');
        },

        onClickOverlay: function () {
            this.$emit('click-overlay');
            this.onClose();
        },

        onGetUserInfo() {
            console.log('占位：函数 onGetUserInfo 未声明');
        },

        onContact() {
            console.log('占位：函数 onContact 未声明');
        },

        onGetPhoneNumber() {
            console.log('占位：函数 onGetPhoneNumber 未声明');
        },

        onError() {
            console.log('占位：函数 onError 未声明');
        },

        onLaunchApp() {
            console.log('占位：函数 onLaunchApp 未声明');
        },

        onOpenSetting() {
            console.log('占位：函数 onOpenSetting 未声明');
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-action-sheet {
    color: var(--action-sheet-item-text-color, #323233);
    max-height: var(--action-sheet-max-height, 90%) !important;
}
.van-action-sheet__cancel,
.van-action-sheet__item {
    background-color: var(--action-sheet-item-background, #fff);
    font-size: var(--action-sheet-item-font-size, 16px);
    line-height: var(--action-sheet-item-line-height, 22px);
    padding: 14px 16px;
    text-align: center;
}
.van-action-sheet__cancel--hover,
.van-action-sheet__item--hover {
    background-color: #f2f3f5;
}
.van-action-sheet__cancel:after,
.van-action-sheet__item:after {
    border-width: 0;
}
.van-action-sheet__cancel {
    color: var(--action-sheet-cancel-text-color, #646566);
}
.van-action-sheet__gap {
    background-color: var(--action-sheet-cancel-padding-color, #f7f8fa);
    display: block;
    height: var(--action-sheet-cancel-padding-top, 8px);
}
.van-action-sheet__item--disabled {
    color: var(--action-sheet-item-disabled-text-color, #c8c9cc);
}
.van-action-sheet__item--disabled.van-action-sheet__item--hover {
    background-color: var(--action-sheet-item-background, #fff);
}
.van-action-sheet__subname {
    color: var(--action-sheet-subname-color, #969799);
    font-size: var(--action-sheet-subname-font-size, 12px);
    line-height: var(--action-sheet-subname-line-height, 20px);
    margin-top: var(--padding-xs, 8px);
}
.van-action-sheet__header {
    font-size: var(--action-sheet-header-font-size, 16px);
    font-weight: var(--font-weight-bold, 500);
    line-height: var(--action-sheet-header-height, 48px);
    text-align: center;
}
.van-action-sheet__description {
    color: var(--action-sheet-description-color, #969799);
    font-size: var(--action-sheet-description-font-size, 14px);
    line-height: var(--action-sheet-description-line-height, 20px);
    padding: 20px var(--padding-md, 16px);
    text-align: center;
}
.van-action-sheet__close {
    color: var(--action-sheet-close-icon-color, #c8c9cc);
    font-size: var(--action-sheet-close-icon-size, 22px) !important;
    line-height: inherit !important;
    padding: var(--action-sheet-close-icon-padding, 0 16px);
    position: absolute !important;
    right: 0;
    top: 0;
}
.van-action-sheet__loading {
    display: flex !important;
}
</style>
