<template>
    <!-- miniprogram/custom-tab-bar/index.wxml -->
    <view class="tab-bar">
        <view class="tab-bar-border"></view>
        <view class="tab-bar-item" :data-path="item.pagePath" :data-index="index" @tap="switchTab" v-for="(item, index) in list" :key="index">
            <image class="tab-bar-image" :src="selected === index ? item.selectedIconPath : item.iconPath"></image>

            <view class="tab-bar-view" :style="'color: ' + (selected === index ? selectedColor : color)">{{ item.text }}</view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            color: '#7A7E83',
            selectedColor: '#1382f1',

            list: [
                {
                    pagePath: '/pages/Index/home/home',
                    iconPath: '/static/images/home.png',
                    selectedIconPath: '/static/images/home.png',
                    text: 'Home'
                },
                {
                    pagePath: '/pages/Index/data/data',
                    iconPath: '/static/images/data.png',
                    selectedIconPath: '/static/images/data.png',
                    text: 'Picture/Music'
                },
                {
                    pagePath: '/pages/Index/user/user',
                    iconPath: '/static/images/user.png',
                    selectedIconPath: '/static/images/user.png',
                    text: 'User'
                }
            ],

            selected: ''
        };
    },
    mounted() {
        // 处理小程序 attached 生命周期
        this.attached();
    },
    methods: {
        attached() {},

        switchTab(e) {
            const data = e.currentTarget.dataset;
            const url = data.path;
            uni.switchTab({
                url
            });
        }
    },
    created: function () {}
};
</script>
<style>
.tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 130rpx;
    box-sizing: border-box;
    background: white;
    display: flex;
    padding-bottom: env(safe-area-inset-bottom);
}

.tab-bar-border {
    background-color: rgba(0, 0, 0, 0.33);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1rpx;
    transform: scaleY(0.3);
}

.tab-bar-item {
    flex: 1;
    width: 250rpx;
    height: 118rpx;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.tab-bar-image {
    width: 70rpx;
    height: 70rpx;
}

.tab-bar-view {
    font-size: 30rpx;
}
</style>
