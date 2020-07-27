(function (modules) {
    var installedModules = {};
    
    function __webpack_require__(moduleId) {
    
    if (installedModules[moduleId]) {
    return installedModules[moduleId].exports;
    }
    var module = installedModules[moduleId] = {
    i: moduleId,
    l: false,
    exports: {}
    };
    
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    
    module.l = true;
    
    return module.exports;
    }
    
    
    // Load entry module and return exports
    return __webpack_require__(__webpack_require__.s = "./src\index.js");
    })
    
    
    ({
    
        "./src\index.js":
        (function (module, exports,__webpack_require__) {
    eval(`__webpack_require__("./src\\test.less");

const index2Obj = __webpack_require__("./src\\index2.js");

alert("index文件告诉你：小伙子很帅");
alert("index2文件告诉你：" + index2Obj.value);
module.exports = {};`);
    }),
    
        "./src\test.less":
        (function (module, exports,__webpack_require__) {
    eval(`let style = document.createElement('style');
style.innerHTML = "body {\\n  text-align: center;\\n}\\nbody .my_page {\\n  margin-top: 50px;\\n  line-height: 50px;\\n}\\n";
document.head.appendChild(style);`);
    }),
    
        "./src\index2.js":
        (function (module, exports,__webpack_require__) {
    eval(`module.exports = {
  value: '小姑凉也很赞！'
};`);
    }),
    
    });
