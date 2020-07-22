const path = require('path')

//   拿配置文件
const config = require(path.resolve('webpack.config.js'))
const Compiler = require('../lib/compiler.js')

const compiler = new Compiler(config)
compiler.run();