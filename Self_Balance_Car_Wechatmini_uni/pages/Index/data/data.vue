<template>
    <!-- pages/tab_pages/setting/setting.wxml -->

    <view class="flex flex-jcc flex-ac flex-v" style="width: 100%; height: 80%">
        <van-circle type="2d" :value="value" layer-color="#eeeeee" :color="gradientColor" stroke-width="10" size="150" :text="state" />
    </view>
</template>

<script>
// pages/tab_pages/data/data.js

export default {
    data() {
        return {
            selected: 0,
            value: '',
            gradientColor: '',
            state: ''
        };
    },
    methods: {
        // 在组件实例进入页面节点树时执行
        attached: function () {},

        handlePageShow() {
            if (typeof this.getTabBar === 'function' && this.getTabBar()) {
                this.getTabBar().setData({
                    selected: 1
                });
            }
        }
    },
    // 在组件实例被从页面节点树移除时执行
    destroyed: function () {},
    mounted() {
        // 处理小程序 attached 生命周期
        this.attached();
    },
    created: function () {}
};
</script>
<style>
/* pages/tab_pages/setting/setting.wxss */
page {
    height: 100%;
}
</style>
