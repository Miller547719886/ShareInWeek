/**
 * 路由配置组件
 * 方法：
        @method set(_hash, callback)  # 配置路由信息，参数分别是路由hash、回调函数
        @method bindhashChange(callback)  # 监听hash路由变化，回调函数的参数为change后的hash
* 实例化方法：
        var router = Router.init();
*/

function getHash() {
  return window.location.hash.substring(1);
}

var Router = function () {
    this.hash = getHash();
}

Router.prototype = {
    // 设置路由
    set: function(_hash, callback) {
        var _this = this; // 保存this

        checkRouter(_this.hash);

        _this.bindhashChange(function(__hash) { // 当前
            checkRouter(__hash);
        });
        
        /**
         * 对比跳转路由与当前路由，相等则执行回调
         * @param {String} __hash 
         */
        function checkRouter(__hash) {
            if(_hash === __hash) {
                if(typeof callback === "function") {
                    callback();
                }
            }
        }
    },
    // hashChange事件监听
    bindhashChange: function(callback) {
        var _this = this;
        if (('onhashchange' in window) && ((typeof document.documentMode === 'undefined') || window.documentMode == 8)) {
            _this.addEvent(window, "hashchange", function() {
                _this.hash = getHash();
                if(typeof callback === "function") {
                    callback(_this.hash);
                }
            });
        } else {
            /* 定时任务- */
            setInterval(function () {
                var hash = getHash();
                var thisHash = _this.hash;
                var ischanged = Boolean(thisHash !== hash);
                if (ischanged) {
                    thisHash = hash;
                    if(typeof callback === "function") {
                        callback(thisHash);
                    }
                }
            }, 150);
        }
    },
    // 事件绑定函数兼容
    addEvent: function (ele, eventType, callback) {
        if (ele.addEventListener) {
            return ele.addEventListener(eventType, callback, false);
        } else if (ele.attachEvent) {
            return ele.attachEvent(eventType, callback);
        } else {
            return ele["on" + eventType] = callback;
        }
    }
};

// 实例化
// Router.init = function() {
//     var router = new Router();
//     return router;
// };