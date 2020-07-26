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
    })({
    
        "./src\index.js":
        (function (module, exports,__webpack_require__) {
    eval(`const a = __webpack_require__("./src\\index2.js");

alert("a=" + JSON.stringify(a)); // require("./test.css");

__webpack_require__("./src\\test.less");

module.exports = {
  name: "aaa"
};`);
    }),
    
        "./src\index2.js":
        (function (module, exports,__webpack_require__) {
    eval(`alert("hello word 2");
module.exports = {
  a: 5
};`);
    }),
    
        "./src\test.less":
        (function (module, exports,__webpack_require__) {
    eval(`let style = document.createElement('style');
style.innerHTML = ".a {\\n  font-size: 1px;\\n}\\n.a .b {\\n  font-size: 2px;\\n}\\n";
document.head.appendChild(style);`);
    }),
    
    });
