<template>
    <view class="van-calendar__header">
        <block v-if="showTitle">
            <view class="van-calendar__header-title"><slot name="title"></slot></view>
            <view class="van-calendar__header-title">{{ title }}</view>
        </block>

        <view v-if="showSubtitle" class="van-calendar__header-subtitle" @tap="onClickSubtitle">
            {{ subtitle }}
        </view>

        <view class="van-calendar__weekdays">
            <view class="van-calendar__weekday" v-for="(item, index) in weekdays" :key="index">
                {{ item }}
            </view>
        </view>
    </view>
</template>

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
var component_1 = require('../../../common/component');
export default {
    data() {
        return {
            weekdays: []
        };
    },
    props: {
        title: {
            type: String,
            default: '日期选择'
        },
        subtitle: String,
        showTitle: Boolean,
        showSubtitle: Boolean,
        firstDayOfWeek: {
            type: Number
        }
    },
    created: function () {
        this.initWeekDay();
    },
    methods: {
        initWeekDay: function () {
            var defaultWeeks = ['日', '一', '二', '三', '四', '五', '六'];
            var firstDayOfWeek = this.firstDayOfWeek || 0;
            this.setData({
                weekdays: __spreadArray(__spreadArray([], defaultWeeks.slice(firstDayOfWeek, 7), true), defaultWeeks.slice(0, firstDayOfWeek), true)
            });
        },
        onClickSubtitle: function (event) {
            this.$emit('click-subtitle', event);
        }
    },
    watch: {
        firstDayOfWeek: {
            handler: function () {
                var defaultWeeks = ['日', '一', '二', '三', '四', '五', '六'];
                var firstDayOfWeek = this.firstDayOfWeek || 0;
                this.setData({
                    weekdays: __spreadArray(__spreadArray([], defaultWeeks.slice(firstDayOfWeek, 7), true), defaultWeeks.slice(0, firstDayOfWeek), true)
                });
            },

            immediate: true
        }
    }
};
</script>
<style>
@import '../../../common/index.css';
.van-calendar__header {
    box-shadow: var(--calendar-header-box-shadow, 0 2px 10px hsla(220, 1%, 50%, 0.16));
    flex-shrink: 0;
}
.van-calendar__header-subtitle,
.van-calendar__header-title {
    font-weight: var(--font-weight-bold, 500);
    height: var(--calendar-header-title-height, 44px);
    line-height: var(--calendar-header-title-height, 44px);
    text-align: center;
}
.van-calendar__header-title + .van-calendar__header-title,
.van-calendar__header-title:empty {
    display: none;
}
.van-calendar__header-title:empty + .van-calendar__header-title {
    display: block !important;
}
.van-calendar__weekdays {
    display: flex;
}
.van-calendar__weekday {
    flex: 1;
    font-size: var(--calendar-weekdays-font-size, 12px);
    line-height: var(--calendar-weekdays-height, 30px);
    text-align: center;
}
</style>
