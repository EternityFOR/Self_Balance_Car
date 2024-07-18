<template>
    <view>
        <!-- pages/tab_pages/setting/setting.wxml -->
        <van-cell is-link title="Feedback" link-type="navigateTo" url="" size="large" />
        <van-cell is-link title="Setting" link-type="navigateTo" url="" size="large" />
        <van-cell is-link title="About" link-type="navigateTo" url="/pages/Index/user/About/About" size="large" />
    </view>
</template>

<script>
// pages/tab_pages/setting/setting.js
export default {
    data() {
        return {
            selected: 0
        };
    },
    methods: {
        handlePageShow() {
            if (typeof this.getTabBar === 'function' && this.getTabBar()) {
                this.getTabBar().setData({
                    selected: 2
                });
            }
        }
    },
    created: function () {}
};
</script>
<style>
/* pages/tab_pages/setting/setting.wxss */
</style>
