<template>
  <view class="about">
    <van-cell-group>
		<van-cell title="Acknowledgment:" title-class = "cell-title" title-width = "100%" use-label-slot clickable="true" @click="confirmOpen(1)">
			<view slot="label">
				<view class="description">
					The Bluetooth provisioning feature(BLUFI) of this project is based on the open-source project by the author xuhonggv from Ai-Thinker Technology on GitHub, and has been further developed. We appreciate the author's selfless contribution.
				</view>	
				<view style="height: 1em;"></view>
				<view class="link_title">
					Project Link:
				</view>
				<view class="link">
					https://github.com/Ai-Thinker-Open/Ai-Thinker-Open-WechatMini-ESP32-C3
				</view>
			</view>
		</van-cell>
		
		<van-cell title="This Project:" title-class = "cell-title" title-width = "100%" use-label-slot clickable="true" @click="confirmOpen(2)">
			<view slot="label">
				<view class="link">
					https://github.com/EternityFOR
				</view>
			</view>
		</van-cell>
    </van-cell-group>
	<van-dialog id="van-dialog" />
  </view>
</template>

<script>
  import Dialog from 'wxcomponents/vant/dialog/dialog';
  export default {
    methods: {
      confirmOpen(res) {
        Dialog.confirm({
          title: 'Open Link',
          message: 'Are you sure you want to open this link?'
        }).then(() => {
          this.openLink(res);
        }).catch(() => {
          // on cancel
        });
      },
      openLink(res) {
        if (res == 1) {
          plus.runtime.openURL('https://github.com/Ai-Thinker-Open/Ai-Thinker-Open-WechatMini-ESP32-C3');
        } else if (res == 2) {
          plus.runtime.openURL('https://github.com/EternityFOR');
        }
      }
    }
  }
</script>

<style>
	
.cell-title{
	font-size: 110% !important;
	font-weight: bolder !important;
}
.description{
	text-align: justify;
}
.link_title{
	color: #474747;
	font-size: 100%;
	font-weight: bolder;
}
.link{
	color: #0062ff;
	text-align: justify;
}
</style>