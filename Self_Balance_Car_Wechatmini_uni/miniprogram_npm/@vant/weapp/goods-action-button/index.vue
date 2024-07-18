<template>
    <view>
        <van-button
            :id="id"
            :lang="lang"
            :type="type"
            :color="color"
            :plain="plain"
            :loading="loading"
            :disabled="disabled"
            :open-type="openType"
            :class="utils.bem('goods-action-button', [type, { first: isFirst, last: isLast, plain: plain }])"
            custom-class="van-goods-action-button__inner"
            :business-id="businessId"
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
            {{ text }}
            <slot></slot>
        </van-button>
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/utils.wxs"></script>
<script>
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var component_1 = require('../common/component');
var relation_1 = require('../common/relation');
var button_1 = require('../mixins/button');
var link_1 = require('../mixins/link');
export default {
    data() {
        return {
            isFirst: '',
            isLast: '',
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
    mixins: [link_1.link, button_1.button],
    relation: (0, relation_1.useParent)('goods-action'),
    props: {
        text: String,
        color: String,
        loading: Boolean,
        disabled: Boolean,
        plain: Boolean,
        type: {
            type: String,
            default: 'danger'
        }
    },
    methods: {
        onClick: function (event, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(event, _dataset);
            /* ---处理dataset end--- */
            this.$emit('click', event.detail);
            this.jumpLink();
        },

        updateStyle: function () {
            if (this.parent == null) {
                return;
            }
            var index = this.index;
            var _a = this.parent.children;
            var children = _a === void 0 ? [] : _a;
            this.setData({
                isFirst: index === 0,
                isLast: index === children.length - 1
            });
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
:host {
    flex: 1;
}
.van-goods-action-button {
    --button-warning-background-color: var(--goods-action-button-warning-color, linear-gradient(to right, #ffd01e, #ff8917));
    --button-danger-background-color: var(--goods-action-button-danger-color, linear-gradient(to right, #ff6034, #ee0a24));
    --button-default-height: var(--goods-action-button-height, 40px);
    --button-line-height: var(--goods-action-button-line-height, 20px);
    --button-plain-background-color: var(--goods-action-button-plain-color, #fff);
    --button-border-width: 0;
    display: block;
}
.van-goods-action-button--first {
    --button-border-radius: 999px 0 0 var(--goods-action-button-border-radius, 999px);
    margin-left: 5px;
}
.van-goods-action-button--last {
    --button-border-radius: 0 999px var(--goods-action-button-border-radius, 999px) 0;
    margin-right: 5px;
}
.van-goods-action-button--first.van-goods-action-button--last {
    --button-border-radius: var(--goods-action-button-border-radius, 999px);
}
.van-goods-action-button--plain {
    --button-border-width: 1px;
}
.van-goods-action-button__inner {
    font-weight: var(--font-weight-bold, 500) !important;
    width: 100%;
}
@media (max-width: 321px) {
    .van-goods-action-button {
        font-size: 13px;
    }
}
</style>
