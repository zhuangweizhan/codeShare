const less = require('less')

function loader(source) {
    let css = ''
    less.render(source, function(err, output) {
        css = output.css
    })

    css = css.replace(/\n/g, '\\n')
    let style = `
    let style = document.createElement('style')
    style.innerHTML = \n${JSON.stringify(css)}
    document.head.appendChild(style)
    `
    return style
}
module.exports = loader;