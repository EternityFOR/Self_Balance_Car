<template>
    <view>
        <van-overlay v-if="overlay" :show="show" :z-index="zIndex" :custom-style="overlayStyle" :duration="duration" @click="onClickOverlay" :lock-scroll="lockScroll" />
        <view
            v-if="inited"
            :class="'custom-class ' + classes + ' ' + utils.bem('popup', [position, { round, safe: safeAreaInsetBottom, safeTop: safeAreaInsetTop }])"
            :style="computed.popupStyle({ zIndex, currentDuration, display, customStyle })"
            @transitionend="onTransitionEnd"
        >
            <slot />
            <van-icon
                v-if="closeable"
                :name="closeIcon"
                :class="'close-icon-class van-popup__close-icon van-popup__close-icon--' + closeIconPosition"
                @tap.native="onClickCloseIcon"
            />
        </view>
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/utils.wxs"></script>
<script module="computed" lang="wxs" src="@/miniprogram_npm/@vant/weapp/popup/index.wxs"></script>
<script>
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var component_1 = require('../common/component');
var transition_1 = require('../mixins/transition');
export default {
    data() {
        return {
            show: '',
            duration: '',
            inited: '',
            classes: ''
        };
    },
    classes: ['enter-class', 'enter-active-class', 'enter-to-class', 'leave-class', 'leave-active-class', 'leave-to-class', 'close-icon-class'],
    mixins: [(0, transition_1.transition)(false)],
    props: {
        round: Boolean,
        closeable: Boolean,
        customStyle: String,
        overlayStyle: String,
        transition: {
            type: String
        },
        zIndex: {
            type: Number,
            default: 100
        },
        overlay: {
            type: Boolean,
            default: true
        },
        closeIcon: {
            type: String,
            default: 'cross'
        },
        closeIconPosition: {
            type: String,
            default: 'top-right'
        },
        closeOnClickOverlay: {
            type: Boolean,
            default: true
        },
        position: {
            type: String,
            default: 'center'
        },
        safeAreaInsetBottom: {
            type: Boolean,
            default: true
        },
        safeAreaInsetTop: {
            type: Boolean,
            default: false
        },
        lockScroll: {
            type: Boolean,
            default: true
        }
    },
    created: function () {
        this.observeClass();
    },
    methods: {
        onClickCloseIcon: function () {
            this.$emit('close');
        },

        onClickOverlay: function () {
            this.$emit('click-overlay');
            if (this.closeOnClickOverlay) {
                this.$emit('close');
            }
        },

        observeClass: function () {
            var _a = this;
            var transition = _a.transition;
            var position = _a.position;
            var duration = _a.duration;
            var updateData = {
                name: transition || position
            };
            if (transition === 'none') {
                updateData.duration = 0;
                this.originDuration = duration;
            } else if (this.originDuration != null) {
                updateData.duration = this.originDuration;
            }
            this.setData(updateData);
        },

        onTransitionEnd() {
            console.log('占位：函数 onTransitionEnd 未声明');
        }
    },
    watch: {
        transition: {
            handler: function () {
                var _a = this;
                var transition = _a.transition;
                var position = _a.position;
                var duration = _a.duration;
                var updateData = {
                    name: transition || position
                };
                if (transition === 'none') {
                    updateData.duration = 0;
                    this.originDuration = duration;
                } else if (this.originDuration != null) {
                    updateData.duration = this.originDuration;
                }
                this.setData(updateData);
            },

            immediate: true
        },

        position: {
            handler: function () {
                var _a = this;
                var transition = _a.transition;
                var position = _a.position;
                var duration = _a.duration;
                var updateData = {
                    name: transition || position
                };
                if (transition === 'none') {
                    updateData.duration = 0;
                    this.originDuration = duration;
                } else if (this.originDuration != null) {
                    updateData.duration = this.originDuration;
                }
                this.setData(updateData);
            },

            immediate: true
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-popup {
    -webkit-overflow-scrolling: touch;
    animation: ease both;
    background-color: var(--popup-background-color, #fff);
    box-sizing: border-box;
    max-height: 100%;
    overflow-y: auto;
    position: fixed;
    transition-timing-function: ease;
}
.van-popup--center {
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
}
.van-popup--center.van-popup--round {
    border-radius: var(--popup-round-border-radius, 16px);
}
.van-popup--top {
    left: 0;
    top: 0;
    width: 100%;
}
.van-popup--top.van-popup--round {
    border-radius: 0 0 var(--popup-round-border-radius, var(--popup-round-border-radius, 16px)) var(--popup-round-border-radius, var(--popup-round-border-radius, 16px));
}
.van-popup--right {
    right: 0;
    top: 50%;
    transform: translate3d(0, -50%, 0);
}
.van-popup--right.van-popup--round {
    border-radius: var(--popup-round-border-radius, var(--popup-round-border-radius, 16px)) 0 0 var(--popup-round-border-radius, var(--popup-round-border-radius, 16px));
}
.van-popup--bottom {
    bottom: 0;
    left: 0;
    width: 100%;
}
.van-popup--bottom.van-popup--round {
    border-radius: var(--popup-round-border-radius, var(--popup-round-border-radius, 16px)) var(--popup-round-border-radius, var(--popup-round-border-radius, 16px)) 0 0;
}
.van-popup--left {
    left: 0;
    top: 50%;
    transform: translate3d(0, -50%, 0);
}
.van-popup--left.van-popup--round {
    border-radius: 0 var(--popup-round-border-radius, var(--popup-round-border-radius, 16px)) var(--popup-round-border-radius, var(--popup-round-border-radius, 16px)) 0;
}
.van-popup--bottom.van-popup--safe {
    padding-bottom: env(safe-area-inset-bottom);
}
.van-popup--safeTop {
    padding-top: env(safe-area-inset-top);
}
.van-popup__close-icon {
    color: var(--popup-close-icon-color, #969799);
    font-size: var(--popup-close-icon-size, 18px);
    position: absolute;
    z-index: var(--popup-close-icon-z-index, 1);
}
.van-popup__close-icon--top-left {
    left: var(--popup-close-icon-margin, 16px);
    top: var(--popup-close-icon-margin, 16px);
}
.van-popup__close-icon--top-right {
    right: var(--popup-close-icon-margin, 16px);
    top: var(--popup-close-icon-margin, 16px);
}
.van-popup__close-icon--bottom-left {
    bottom: var(--popup-close-icon-margin, 16px);
    left: var(--popup-close-icon-margin, 16px);
}
.van-popup__close-icon--bottom-right {
    bottom: var(--popup-close-icon-margin, 16px);
    right: var(--popup-close-icon-margin, 16px);
}
.van-popup__close-icon:active {
    opacity: 0.6;
}
.van-scale-enter-active,
.van-scale-leave-active {
    transition-property: opacity, transform;
}
.van-scale-enter,
.van-scale-leave-to {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) scale(0.7);
}
.van-fade-enter-active,
.van-fade-leave-active {
    transition-property: opacity;
}
.van-fade-enter,
.van-fade-leave-to {
    opacity: 0;
}
.van-center-enter-active,
.van-center-leave-active {
    transition-property: opacity;
}
.van-center-enter,
.van-center-leave-to {
    opacity: 0;
}
.van-bottom-enter-active,
.van-bottom-leave-active,
.van-left-enter-active,
.van-left-leave-active,
.van-right-enter-active,
.van-right-leave-active,
.van-top-enter-active,
.van-top-leave-active {
    transition-property: transform;
}
.van-bottom-enter,
.van-bottom-leave-to {
    transform: translate3d(0, 100%, 0);
}
.van-top-enter,
.van-top-leave-to {
    transform: translate3d(0, -100%, 0);
}
.van-left-enter,
.van-left-leave-to {
    transform: translate3d(-100%, -50%, 0);
}
.van-right-enter,
.van-right-leave-to {
    transform: translate3d(100%, -50%, 0);
}
</style>
