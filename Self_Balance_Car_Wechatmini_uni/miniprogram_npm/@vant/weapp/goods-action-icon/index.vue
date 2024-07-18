<template>
    <view>
        <van-button
            square
            :id="id"
            size="large"
            :lang="lang"
            :loading="loading"
            :disabled="disabled"
            :open-type="openType"
            :business-id="businessId"
            custom-class="van-goods-action-icon"
            :session-from="sessionFrom"
            :app-parameter="appParameter"
            :send-message-img="sendMessageImg"
            :send-message-path="sendMessagePath"
            :show-message-card="showMessageCard"
            :send-message-title="sendMessageTitle"
            @click="onClick($event, { tagId: id })"
            @error="onError($event, { tagId: id })"
            @contact="onContact($event, { tagId: id })"
            @opensetting="onOpenSetting($event, { tagId: id })"
            @getuserinfo="onGetUserInfo($event, { tagId: id })"
            @getphonenumber="onGetPhoneNumber($event, { tagId: id })"
            @launchapp="onLaunchApp($event, { tagId: id })"
        >
            <van-icon v-if="icon" :name="icon" :dot="dot" :info="info" :class-prefix="classPrefix" class="van-goods-action-icon__icon" custom-class="icon-class" />
            <slot v-else name="icon" />
            <text class="text-class">{{ text }}</text>
        </van-button>
    </view>
</template>

<script>
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var component_1 = require('../common/component');
var button_1 = require('../mixins/button');
var link_1 = require('../mixins/link');
export default {
    data() {
        return {
            id: '',
            lang: '',
            openType: '',
            businessId: '',
            sessionFrom: '',
            appParameter: '',
            sendMessageImg: '',
            sendMessagePath: '',
            showMessageCard: '',
            sendMessageTitle: ''
        };
    },
    classes: ['icon-class', 'text-class'],
    mixins: [link_1.link, button_1.button],
    props: {
        text: String,
        dot: Boolean,
        info: String,
        icon: String,
        classPrefix: {
            type: String,
            default: 'van-icon'
        },
        disabled: Boolean,
        loading: Boolean
    },
    methods: {
        onClick: function (event, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(event, _dataset);
            /* ---处理dataset end--- */
            this.$emit('click', event.detail);
            this.jumpLink();
        },

        onError(e, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(e, _dataset);
            /* ---处理dataset end--- */
            console.log('占位：函数 onError 未声明');
        },

        onContact(e, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(e, _dataset);
            /* ---处理dataset end--- */
            console.log('占位：函数 onContact 未声明');
        },

        onOpenSetting(e, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(e, _dataset);
            /* ---处理dataset end--- */
            console.log('占位：函数 onOpenSetting 未声明');
        },

        onGetUserInfo(e, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(e, _dataset);
            /* ---处理dataset end--- */
            console.log('占位：函数 onGetUserInfo 未声明');
        },

        onGetPhoneNumber(e, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(e, _dataset);
            /* ---处理dataset end--- */
            console.log('占位：函数 onGetPhoneNumber 未声明');
        },

        onLaunchApp(e, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(e, _dataset);
            /* ---处理dataset end--- */
            console.log('占位：函数 onLaunchApp 未声明');
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-goods-action-icon {
    border: none !important;
    color: var(--goods-action-icon-text-color, #646566) !important;
    display: flex !important;
    flex-direction: column;
    font-size: var(--goods-action-icon-font-size, 10px) !important;
    height: var(--goods-action-icon-height, 50px) !important;
    justify-content: center !important;
    line-height: 1 !important;
    min-width: var(--goods-action-icon-width, 48px);
}
.van-goods-action-icon__icon {
    color: var(--goods-action-icon-color, #323233);
    display: flex;
    font-size: var(--goods-action-icon-size, 18px);
    margin: 0 auto 5px;
}
</style>
