'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.useChildren = exports.useParent = void 0;
function useParent(name, onEffect) {
    var _a;
    var path = '../'.concat(name, '/index');
    return {
        relations: {},
        mixin: {
            created: function () {
                var that = this;
                Object.defineProperty(this, 'parent', {
                    get: function () {
                        return that.getRelationNodes(path)[0];
                    }
                });
                Object.defineProperty(this, 'index', {
                    // @ts-ignore
                    get: function () {
                        var _a;
                        var _b;
                        return (_b = (_a = that.parent) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b.indexOf(that);
                    }
                });
            }
        }
    };
}
exports.useParent = useParent;
function useChildren(name, onEffect) {
    var _a;
    var path = '../'.concat(name, '/index');
    return {
        relations: {},
        mixin: {
            created: function () {
                var that = this;
                Object.defineProperty(this, 'children', {
                    get: function () {
                        return that.getRelationNodes(path) || [];
                    }
                });
            }
        }
    };
}
exports.useChildren = useChildren;
