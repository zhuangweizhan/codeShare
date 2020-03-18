
/*
	本代码来自weizhan
	github链接：https://github.com/zhuangweizhan
	csdn链接：https://blog.csdn.net/zhuangweizhan/
*/

(function (window) {
    var zQuery = function (selector) {
        return new zQuery.fn.init(selector);
    }
    zQuery.fn = {
        init: function (selector, myDocument) {
            // this.dom = this.dom ? this.dom : [];
            this.dom = [];
            this.myDocument = myDocument ? myDocument : document;
            const childNodes = this.myDocument.childNodes;
            var rs = null;
            if (typeof (selector) != 'undefined') {
                if (selector.substr(0, 1) == "#") {//id选择器
                    rs = this.myDocument.getElementById(selector.slice(1));
                    this.dom[0] = rs;
                    console.log("rs===" + rs.innerText + rs.innerHTML);
                } else if (selector.substr(0, 1) == ".") { //样式选择器
                    rs = this.myDocument.getElementsByClassName(selector.slice(1));
                    for (var i = 0; i < rs.length; i++) {
                        this.dom[i] = rs[i];
                    }
                }
            }
            return this;
        },
        find: function (selector) {
            if (this.dom.length == 1) {
                this.init(selector, this.dom[0]);
            } else if (this.dom.length > 1) {
                for (var i = 0; i < this.dom.length; i++) {
                    this.init(selector, this.dom[i]);
                }
            }
            return this;
        },
        html: function (value) {
            if (this.dom.length == 1) {
                this.dom[0].innerHTML = value;
            } else if (this.length > 1) {
                for (var i = 0; i < this.dom.length; i++) {
                    this.dom[i].style[attr] = value;
                }
            }
        },
        css: function (attr, value) {
            if (this.dom.length == 1) {
                this.dom[0].style[attr] = value;
            } else if (this.dom.length > 1) {
                for (var i = 0; i < this.dom.length; i++) {
                    this.dom[i].style[attr] = value;
                }
            }
        },
        show: function (attr, value) {
            if (this.dom.length == 1) {
                this.dom[0].style.display = 'block';
            } else if (this.dom.length > 1) {
                for (var i = 0; i < this.dom.length; i++) {
                    this.dom[i].style.display = 'block';
                }
            }
        },
        hide: function (attr, value) {
            if (this.dom.length == 1) {
                this.dom[0].style.display = 'none';
            } else if (this.dom.length > 1) {
                for (var i = 0; i < this.dom.length; i++) {
                    this.dom[i].style.display = 'none';
                }
            }
        },
        //异常请求
        ajax: function ({ url, dataType, success }) {
            var xhr = new XMLHttpRequest();
            xhr.open(dataType, url);
            xhr.send(null);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    success(xhr.responseText);
                };
            }
        },
    }

    zQuery.fn.init.prototype = zQuery.fn;
    window.$ = zQuery;
})(window);

