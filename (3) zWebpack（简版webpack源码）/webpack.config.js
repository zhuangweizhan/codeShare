const path = require('path')
const {delFileFolderByName, delFileByName} = require('./lib/utils')
var fs = require("fs");


class InitPlugin {
    run(compiler) {
        // 将的在执行期放到刚开始解析入口前
        compiler.hooks.entryInit.tap('Init', function(res) {
            console.log(`前端小伙子，编译开始咯。`);
        })
    }
}

class CleanDistPlugins {
    run(compiler) {
        // 将自身方法订阅到hook以备使用
        //假设它的运行期在编译完成之后
        compiler.hooks.beforeCompile.tap('CleanDistPlugins', function(res) {
            delFileFolderByName('./dist/');
        })
    }
}


class JsCopyPlugins {
    run(compiler) {
        compiler.hooks.afteremit.tap('JsCopyPlugins', function(res) {
            const ranNum = parseInt( Math.random() * 100000000 );
            fs.copyFile('./dist/main.js',`./dist/main.${ranNum}.js`,function(err){
                if(err) console.log('获取文件失败');
                delFileByName('./dist/main.js');
            })
            console.log("重新生成js成功" );
            return ranNum;
        })
    }
}

class HtmlReloadPlugins {
    run(compiler) {
        compiler.hooks.afteremit.tap('HtmlReloadPlugins', function(res) {
            let content = fs.readFileSync('./public/index.html', 'utf8')
            content = content.replace('main.js', `main.${res}.js`);
            fs.writeFileSync( './dist/index.html', content)
        })
    }
}

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.join(__dirname, './dist')
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: [path.join(__dirname, './lib/loader/less-loader.js')]
        },{
            test: /\.css$/,
            use: [path.join(__dirname, './lib/loader/style-loader.js')]
        }]
    },
    plugins: [
        new InitPlugin(),
        new CleanDistPlugins(),
        new JsCopyPlugins(),
        new HtmlReloadPlugins()
    ]
}
