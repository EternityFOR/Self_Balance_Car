<template>
    <view class="van-uploader">
        <view class="van-uploader__wrapper">
            <!-- 预览样式 -->
            <view v-if="previewImage" class="van-uploader__preview" :data-index="index" @tap="onClickPreview" v-for="(item, index) in lists" :key="index">
                <image
                    v-if="item.isImage"
                    :mode="imageFit"
                    :src="item.thumb || item.url"
                    :alt="item.name || '图片' + index"
                    class="van-uploader__preview-image"
                    :style="computed.sizeStyle({ previewSize })"
                    :data-index="index"
                    @tap="onPreviewImage"
                />

                <video
                    v-else-if="item.isVideo"
                    :src="item.url"
                    :title="item.name || '视频' + index"
                    :poster="item.thumb"
                    :autoplay="item.autoplay"
                    class="van-uploader__preview-image"
                    :style="computed.sizeStyle({ previewSize })"
                    :data-index="index"
                    @tap="onPreviewVideo"
                ></video>

                <view v-else class="van-uploader__file" :style="computed.sizeStyle({ previewSize })" :data-index="index" @tap="onPreviewFile">
                    <van-icon name="description" class="van-uploader__file-icon" />
                    <view class="van-uploader__file-name van-ellipsis">{{ item.name || item.url }}</view>
                </view>

                <view v-if="item.status === 'uploading' || item.status === 'failed'" class="van-uploader__mask">
                    <van-icon v-if="item.status === 'failed'" name="close" class="van-uploader__mask-icon" />
                    <van-loading v-else custom-class="van-uploader__loading" />
                    <text v-if="item.message" class="van-uploader__mask-message">{{ item.message }}</text>
                </view>

                <view v-if="deletable && item.deletable" :data-index="index" class="van-uploader__preview-delete" @tap.stop.prevent="deleteItem">
                    <van-icon name="cross" class="van-uploader__preview-delete-icon" />
                </view>
            </view>

            <!-- 上传样式 -->
            <block v-if="isInCount">
                <view class="van-uploader__slot" @tap="startUpload">
                    <slot />
                </view>

                <!-- 默认上传样式 -->
                <view
                    v-if="showUpload"
                    :class="'van-uploader__upload ' + (disabled ? 'van-uploader__upload--disabled' : '')"
                    :style="computed.sizeStyle({ previewSize })"
                    @tap="startUpload"
                >
                    <van-icon :name="uploadIcon" class="van-uploader__upload-icon" />
                    <text v-if="uploadText" class="van-uploader__upload-text">{{ uploadText }}</text>
                </view>
            </block>
        </view>
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/utils.wxs"></script>
<script module="computed" lang="wxs" src="@/miniprogram_npm/@vant/weapp/uploader/index.wxs"></script>
<script>
'use strict';
var __assign =
    (this && this.__assign) ||
    function () {
        __assign =
            Object.assign ||
            function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s) {
                        if (Object.prototype.hasOwnProperty.call(s, p)) {
                            t[p] = s[p];
                        }
                    }
                }
                return t;
            };
        return __assign.apply(this, arguments);
    };
Object.defineProperty(exports, '__esModule', {
    value: true
});
var component_1 = require('../common/component');
var utils_1 = require('./utils');
var shared_1 = require('./shared');
var validator_1 = require('../common/validator');
export default {
    data() {
        return {
            lists: [],
            isInCount: true,
            previewImage: '',
            imageFit: '',
            deletable: '',
            showUpload: '',
            disabled: false,
            uploadIcon: '',
            uploadText: ''
        };
    },
    props: __assign(
        __assign(
            __assign(
                __assign(
                    {
                        disabled: Boolean,
                        multiple: Boolean,
                        uploadText: String,
                        useBeforeRead: Boolean,
                        afterRead: null,
                        beforeRead: null,
                        previewSize: {
                            type: null,
                            value: 80
                        },
                        name: {
                            type: null,
                            value: ''
                        },
                        accept: {
                            type: String,
                            value: 'image'
                        },
                        fileList: {
                            type: Array,
                            value: [],
                            observer: 'formatFileList'
                        },
                        maxSize: {
                            type: Number,
                            value: Number.MAX_VALUE
                        },
                        maxCount: {
                            type: Number,
                            value: 100
                        },
                        deletable: {
                            type: Boolean,
                            value: true
                        },
                        showUpload: {
                            type: Boolean,
                            value: true
                        },
                        previewImage: {
                            type: Boolean,
                            value: true
                        },
                        previewFullImage: {
                            type: Boolean,
                            value: true
                        },
                        imageFit: {
                            type: String,
                            value: 'scaleToFill'
                        },
                        uploadIcon: {
                            type: String,
                            value: 'photograph'
                        }
                    },
                    shared_1.chooseImageProps
                ),
                shared_1.chooseVideoProps
            ),
            shared_1.chooseMediaProps
        ),
        shared_1.chooseMessageFileProps
    ),
    methods: {
        formatFileList: function () {
            var _a = this;
            var _b = _a.fileList;
            var fileList = _b === void 0 ? [] : _b;
            var maxCount = _a.maxCount;
            var lists = fileList.map(function (item) {
                return __assign(__assign({}, item), {
                    isImage: (0, utils_1.isImageFile)(item),
                    isVideo: (0, utils_1.isVideoFile)(item),
                    deletable: (0, validator_1.isBoolean)(item.deletable) ? item.deletable : true
                });
            });
            this.setData({
                lists: lists,
                isInCount: lists.length < maxCount
            });
        },
        getDetail: function (index) {
            return {
                name: this.name,
                index: index == null ? this.fileList.length : index
            };
        },
        startUpload: function () {
            var that = this;
            var _a = this;
            var maxCount = _a.maxCount;
            var multiple = _a.multiple;
            var lists = _a.lists;
            var disabled = _a.disabled;
            if (disabled) {
                return;
            }
            (0, utils_1.chooseFile)(
                __assign(__assign({}, this), {
                    maxCount: maxCount - lists.length
                })
            )
                .then(function (res) {
                    that.onBeforeRead(multiple ? res : res[0]);
                })
                .catch(function (error) {
                    that.$emit('error', error);
                });
        },
        onBeforeRead: function (file) {
            var that = this;
            var _a = this;
            var beforeRead = _a.beforeRead;
            var useBeforeRead = _a.useBeforeRead;
            var res = true;
            if (typeof beforeRead === 'function') {
                res = beforeRead(file, this.getDetail());
            }
            if (useBeforeRead) {
                res = new Promise(function (resolve, reject) {
                    that.$emit(
                        'before-read',
                        __assign(
                            __assign(
                                {
                                    file: file
                                },
                                that.getDetail()
                            ),
                            {
                                callback: function (ok) {
                                    ok ? resolve() : reject();
                                }
                            }
                        )
                    );
                });
            }
            if (!res) {
                return;
            }
            if ((0, validator_1.isPromise)(res)) {
                res.then(function (data) {
                    return that.onAfterRead(data || file);
                });
            } else {
                this.onAfterRead(file);
            }
        },
        onAfterRead: function (file) {
            var _a = this;
            var maxSize = _a.maxSize;
            var afterRead = _a.afterRead;
            var oversize = Array.isArray(file)
                ? file.some(function (item) {
                      return item.size > maxSize;
                  })
                : file.size > maxSize;
            if (oversize) {
                this.$emit(
                    'oversize',
                    __assign(
                        {
                            file: file
                        },
                        this.getDetail()
                    )
                );
                return;
            }
            if (typeof afterRead === 'function') {
                afterRead(file, this.getDetail());
            }
            this.$emit(
                'after-read',
                __assign(
                    {
                        file: file
                    },
                    this.getDetail()
                )
            );
        },
        deleteItem: function (event) {
            var index = event.currentTarget.dataset.index;
            this.$emit(
                'delete',
                __assign(__assign({}, this.getDetail(index)), {
                    file: this.fileList[index]
                })
            );
        },
        onPreviewImage: function (event) {
            if (!this.previewFullImage) {
                return;
            }
            var index = event.currentTarget.dataset.index;
            var lists = this.lists;
            var item = lists[index];
            uni.previewImage({
                urls: lists
                    .filter(function (item) {
                        return (0, utils_1.isImageFile)(item);
                    })
                    .map(function (item) {
                        return item.url;
                    }),
                current: item.url,
                fail: function () {
                    uni.showToast({
                        title: '预览图片失败',
                        icon: 'none'
                    });
                }
            });
        },
        onPreviewVideo: function (event) {
            if (!this.previewFullImage) {
                return;
            }
            var index = event.currentTarget.dataset.index;
            var lists = this.lists;
            var sources = [];
            var current = lists.reduce(function (sum, cur, curIndex) {
                if (!(0, utils_1.isVideoFile)(cur)) {
                    return sum;
                }
                sources.push(
                    __assign(__assign({}, cur), {
                        type: 'video'
                    })
                );
                if (curIndex < index) {
                    sum++;
                }
                return sum;
            }, 0);
            uni.previewMedia({
                sources: sources,
                current: current,
                fail: function () {
                    uni.showToast({
                        title: '预览视频失败',
                        icon: 'none'
                    });
                }
            });
        },
        onPreviewFile: function (event) {
            var index = event.currentTarget.dataset.index;
            uni.openDocument({
                filePath: this.lists[index].url,
                showMenu: true
            });
        },
        onClickPreview: function (event) {
            var index = event.currentTarget.dataset.index;
            var item = this.lists[index];
            this.$emit('click-preview', __assign(__assign({}, item), this.getDetail(index)));
        }
    }
};
</script>
<style>
@import '../common/index.css';
.van-uploader {
    display: inline-block;
    position: relative;
}
.van-uploader__wrapper {
    display: flex;
    flex-wrap: wrap;
}
.van-uploader__slot:empty {
    display: none;
}
.van-uploader__slot:not(:empty) + .van-uploader__upload {
    display: none !important;
}
.van-uploader__upload {
    align-items: center;
    background-color: var(--uploader-upload-background-color, #f7f8fa);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: var(--uploader-size, 80px);
    justify-content: center;
    margin: 0 8px 8px 0;
    position: relative;
    width: var(--uploader-size, 80px);
}
.van-uploader__upload:active {
    background-color: var(--uploader-upload-active-color, #f2f3f5);
}
.van-uploader__upload-icon {
    color: var(--uploader-icon-color, #dcdee0);
    font-size: var(--uploader-icon-size, 24px);
}
.van-uploader__upload-text {
    color: var(--uploader-text-color, #969799);
    font-size: var(--uploader-text-font-size, 12px);
    margin-top: var(--padding-xs, 8px);
}
.van-uploader__upload--disabled {
    opacity: var(--uploader-disabled-opacity, 0.5);
}
.van-uploader__preview {
    cursor: pointer;
    margin: 0 8px 8px 0;
    position: relative;
}
.van-uploader__preview-image {
    display: block;
    height: var(--uploader-size, 80px);
    overflow: hidden;
    width: var(--uploader-size, 80px);
}
.van-uploader__preview-delete,
.van-uploader__preview-delete:after {
    height: var(--uploader-delete-icon-size, 14px);
    position: absolute;
    right: 0;
    top: 0;
    width: var(--uploader-delete-icon-size, 14px);
}
.van-uploader__preview-delete:after {
    background-color: var(--uploader-delete-background-color, rgba(0, 0, 0, 0.7));
    border-radius: 0 0 0 12px;
    content: '';
}
.van-uploader__preview-delete-icon {
    color: var(--uploader-delete-color, #fff);
    font-size: var(--uploader-delete-icon-size, 14px);
    position: absolute;
    right: 0;
    top: 0;
    transform: scale(0.7) translate(10%, -10%);
    z-index: 1;
}
.van-uploader__file {
    align-items: center;
    background-color: var(--uploader-file-background-color, #f7f8fa);
    display: flex;
    flex-direction: column;
    height: var(--uploader-size, 80px);
    justify-content: center;
    width: var(--uploader-size, 80px);
}
.van-uploader__file-icon {
    color: var(--uploader-file-icon-color, #646566);
    font-size: var(--uploader-file-icon-size, 20px);
}
.van-uploader__file-name {
    box-sizing: border-box;
    color: var(--uploader-file-name-text-color, #646566);
    font-size: var(--uploader-file-name-font-size, 12px);
    margin-top: var(--uploader-file-name-margin-top, 8px);
    padding: var(--uploader-file-name-padding, 0 4px);
    text-align: center;
    width: 100%;
}
.van-uploader__mask {
    align-items: center;
    background-color: var(--uploader-mask-background-color, rgba(50, 50, 51, 0.88));
    bottom: 0;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
}
.van-uploader__mask-icon {
    font-size: var(--uploader-mask-icon-size, 22px);
}
.van-uploader__mask-message {
    font-size: var(--uploader-mask-message-font-size, 12px);
    line-height: var(--uploader-mask-message-line-height, 14px);
    margin-top: 6px;
    padding: 0 var(--padding-base, 4px);
}
.van-uploader__loading {
    color: var(--uploader-loading-icon-color, #fff) !important;
    height: var(--uploader-loading-icon-size, 22px);
    width: var(--uploader-loading-icon-size, 22px);
}
</style>
