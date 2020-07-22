const path = require('path')
const fs = require('fs')
const { assert } = require('console')
    // babylon  主要把源码转成ast Babylon 是 Babel 中使用的 JavaScript 解析器。
    // @babel/traverse 对ast解析遍历语法树 负责替换，删除和添加节点
    // @babel/types 用于AST节点的Lodash-esque实用程序库
    // @babel/generator 结果生成

const babylon = require('babylon')
const traverse = require('@babel/traverse').default;
const type = require('@babel/types');
const generator = require('@babel/generator').default
const ejs = require('ejs')
const tapable = require('tapable')

class Compiler {
    constructor(config) {
        this.config = config
        this.entryId = ''
        this.modules = {}
        this.entry = config.entry
        this.root = process.cwd() //当前项目地址      
        this.asserts = {} // 存储chunkName与输出代码块
        this.hooks = {
            entryInit: new tapable.SyncHook(),
            beforeCompile: new tapable.SyncHook(),
            afterCompile: new tapable.SyncHook(),
            afterPlugins: new tapable.SyncHook(),
            afteremit: new tapable.SyncHook(),
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
    getSource(modulePath) {
        // 事先拿module中的匹配规则与路径进行匹配
        const rules = this.config.module.rules
        let content = fs.readFileSync(modulePath, 'utf8')

        for (let i = 0; i < rules.length; i++) {
            let { test, use } = rules[i]
            let len = use.length

            // 匹配到了开始走loader,特点从后往前
            if (test.test(modulePath)) {
                console.log(111);

                function normalLoader() {
                    // 先拿最后一个
                    let loader = require(use[--len])
                    content = loader(content)

                    if (len > 0) {
                        normalLoader()
                    }
                }
                normalLoader()
            }
        }
        return content
    }

    // 源码改造
    parse(source, parentPath) {
        // ast语法树
        let ast = babylon.parse(source)

        // 用于存取依赖
        let dependencies = []
        traverse(ast, {
            CallExpression(p) {
                let node = p.node
                    // 对require方法进行改名
                if (node.callee.name === 'require') {
                    node.callee.name = '__webpack_require__'
                    let moduledName = node.arguments[0].value // 取到require方法里的路径

                    // 改造其后缀名
                    moduledName = moduledName + (path.extname(moduledName) ? '' : '.js')

                    // 加上其父路径./src
                    moduledName = './' + path.join(parentPath, moduledName)

                    // 加入依赖数组
                    dependencies.push(moduledName)

                    // 源码替换
                    node.arguments = [type.stringLiteral(moduledName)]
                }
            }
        })

        let sourceCode = generator(ast).code
        return { sourceCode, dependencies }
    }

    // 构建模块
    buildMoudle(modulePath, isEntry) {
        let source = this.getSource(modulePath)

        // 其实就是this.entry 啊
        let moduleName = './' + path.relative(this.root, modulePath)
        if (isEntry) {
            this.entryId = moduleName
        }

        // 开始改造源码，主要针对require
        let { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName)) //就是./src

        // 改造完成放入模块中
        this.modules[moduleName] = sourceCode

        // 递归构造依赖模板
        dependencies.forEach(item => {
            this.buildMoudle(path.resolve(this.root, item), false)
        })

    }

    //写的输出位置
    emitFile() {
        // 拿到输出地址
        let outPath = path.join(this.config.output.path, this.config.output.filename)
        // 拿模板
        let templateStr = this.getSource(path.join(__dirname, 'main.ejs'))
        // 填充模板数据
        let code = ejs.render(templateStr, {
            entryId: this.entryId,
            modules: this.modules
        })
        this.asserts[outPath] = code
        console.log(`emitFile.code:${code}`);
        // 写入
        fs.writeFileSync(outPath, this.asserts[outPath])
    }

    run() {
        this.hooks.entryInit.call()
        this.buildMoudle(path.resolve(this.root, this.entry), true)
        this.hooks.afterCompile.call()
        this.emitFile()
    }

}

module.exports = Compiler;