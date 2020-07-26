const path = require('path')
const fs = require('fs')
const { assert } = require('console')
    // babylon  将源码转成ast Babylon 是 Babel 中使用的 JavaScript 解析器。
    // @babel/traverse 对ast解析遍历语法树
    // @babel/types 用于AST节点的Lodash-esque实用程序库
    // @babel/generator 结果生成

const babylon = require('babylon')
const traverse = require('@babel/traverse').default;
const type = require('@babel/types');
const generator = require('@babel/generator').default
const ejs = require('ejs')
const tapable = require('tapable')

class WebpackCompiler {
    constructor(config) {
        this.config = config
        this.modules = {}
        this.root = process.cwd() //当前项目地址      
        this.entryPath = './' + path.relative(this.root, this.config.entry);
        this.hooks = {
            entryInit: new tapable.SyncHook(),
            beforeCompile: new tapable.SyncHook(),
            afterCompile: new tapable.SyncHook(),
            afterPlugins: new tapable.SyncHook(),
            afteremit: new tapable.SyncWaterfallHook(['hash']),
        }
        const plugins = this.config.plugins
        if (Array.isArray(plugins)) {
            plugins.forEach(item => {
                // 每个均是实例，调用实例上的一个方法即可，传入当前Compiler实例
                item.run(this)
            })
        }

    }

    // 获取源码
    getSourceByPath(modulePath) {
        // 事先拿module中的匹配规则与路径进行匹配
        const rules = this.config.module.rules
        let content = fs.readFileSync(modulePath, 'utf8')
        for (let i = 0; i < rules.length; i++) {
            let { test, use } = rules[i]
            let len = use.length

            // 匹配到了开始走loader,特点从后往前
            if (test.test(modulePath)) {
                function changeLoader() {
                    // 先拿最后一个
                    let loader = require(use[--len])
                    content = loader(content)
                    if (len > 0) {
                        changeLoader()
                    }
                }
                changeLoader()
            }
        }
        return content
    }

    // 根据路径解析源码
    parse(source, parentPath) {
        let ast = babylon.parse(source)//
        // 用于存取依赖
        let dependencies = []
        traverse(ast, {//对ast解析遍历语法树 负责替换，删除和添加节点
            CallExpression(p) {
                let node = p.node
                if (node.callee.name === 'require') {
                    node.callee.name = '__webpack_require__';//将require替换成__webpack_require__
                    const moduledName = './' + path.join(parentPath, node.arguments[0].value )
                    dependencies.push(moduledName);//记录包含的requeir的名称，后边需要遍历替换成源码
                    node.arguments = [type.stringLiteral(moduledName)] // 源码替换
                }
            }
        })
        let sourceCode = generator(ast).code
        return { sourceCode, dependencies };
    }

    // 构建模块
    buildMoudle(modulePath) {
        const source = this.getSourceByPath(modulePath);//根据路径拿到源码
        const moduleName = './' + path.relative(this.root, modulePath);//转换一下路径名称
        const { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName))//根据路径拿到源码，以及源码中已经require的文件名称数组
        this.modules[moduleName] = sourceCode;// 每个模块的代码都通过路径为Key,存入到modules对象中
        dependencies.forEach(item => {  // 递归需要转换的文件名称
            this.buildMoudle(path.resolve(this.root, item));////再对应的文件名称，替换成对应的源码
        })
    }

    //输出文件
    outputFile() {
        let templateStr = this.getSourceByPath(path.join(__dirname, 'main.ejs'));  // 拿到步骤1写好的模板
        let code = ejs.render(templateStr, {
            entryPath: this.entryPath,
            modules: this.modules,
        })// 填充模板数据
        let outPath = path.join(this.config.output.path, this.config.output.filename)// 拿到输出地址
        fs.writeFileSync(outPath, code )// 写入
    }

    run() {
        this.hooks.entryInit.call(); //启动项目
        this.hooks.beforeCompile.call();  //编译前运行
        this.buildMoudle( this.entryPath )
        this.hooks.afterCompile.call( ); //编译后运行
        this.outputFile();
        this.hooks.afterPlugins.call( );//执行完plugins后运行
        this.hooks.afteremit.call( );//结束后运行
    }

}

module.exports = WebpackCompiler;