'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.transition = void 0;
// @ts-nocheck
var utils_1 = require('../common/utils');
var validator_1 = require('../common/validator');
var getClassNames = function (name) {
    return {
        enter: 'van-'.concat(name, '-enter van-').concat(name, '-enter-active enter-class enter-active-class'),
        'enter-to': 'van-'.concat(name, '-enter-to van-').concat(name, '-enter-active enter-to-class enter-active-class'),
        leave: 'van-'.concat(name, '-leave van-').concat(name, '-leave-active leave-class leave-active-class'),
        'leave-to': 'van-'.concat(name, '-leave-to van-').concat(name, '-leave-active leave-to-class leave-active-class')
    };
};
function transition(showDefaultValue) {
    return {
        data() {
            return {
                type: '',
                inited: false,
                display: false
            };
        },
        props: {
            customStyle: String,
            // @ts-ignore
            show: {
                type: Boolean,
                value: showDefaultValue,
                observer: 'observeShow'
            },
            // @ts-ignore
            duration: {
                type: null,
                value: 300,
                observer: 'observeDuration'
            },
            name: {
                type: String,
                value: 'fade'
            }
        },
        mounted: function () {
            if (this.show === true) {
                this.observeShow(true, false);
            }
        },
        methods: {
            observeShow: function (value, old) {
                if (value === old) {
                    return;
                }
                if (value) {
                    this.enter();
                } else {
                    this.leave();
                }
            },
            enter: function () {
                var that = this;
                var _a = this;
                var duration = _a.duration;
                var name = _a.name;
                var classNames = getClassNames(name);
                var currentDuration = (0, validator_1.isObj)(duration) ? duration.enter : duration;
                if (this.status === 'enter') {
                    return;
                }
                this.status = 'enter';
                this.$emit('before-enter');
                (0, utils_1.requestAnimationFrame)(function () {
                    if (that.status !== 'enter') {
                        return;
                    }
                    that.$emit('enter');
                    that.setData({
                        inited: true,
                        display: true,
                        classes: classNames.enter,
                        currentDuration: currentDuration
                    });
                    (0, utils_1.requestAnimationFrame)(function () {
                        if (that.status !== 'enter') {
                            return;
                        }
                        that.transitionEnded = false;
                        that.setData({
                            classes: classNames['enter-to']
                        });
                    });
                });
            },
            leave: function () {
                var that = this;
                if (!this.display) {
                    return;
                }
                var _a = this;
                var duration = _a.duration;
                var name = _a.name;
                var classNames = getClassNames(name);
                var currentDuration = (0, validator_1.isObj)(duration) ? duration.leave : duration;
                this.status = 'leave';
                this.$emit('before-leave');
                (0, utils_1.requestAnimationFrame)(function () {
                    if (that.status !== 'leave') {
                        return;
                    }
                    that.$emit('leave');
                    that.setData({
                        classes: classNames.leave,
                        currentDuration: currentDuration
                    });
                    (0, utils_1.requestAnimationFrame)(function () {
                        if (that.status !== 'leave') {
                            return;
                        }
                        that.transitionEnded = false;
                        setTimeout(function () {
                            return that.onTransitionEnd();
                        }, currentDuration);
                        that.setData({
                            classes: classNames['leave-to']
                        });
                    });
                });
            },
            onTransitionEnd: function () {
                if (this.transitionEnded) {
                    return;
                }
                this.transitionEnded = true;
                this.$emit('after-'.concat(this.status));
                var _a = this;
                var show = _a.show;
                var display = _a.display;
                if (!show && display) {
                    this.setData({
                        display: false
                    });
                }
            }
        }
    };
}
exports.transition = transition;
