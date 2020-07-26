function loader(source) {
    let style = `
    let style = document.createElement('style')
    style.innerHTML = \n${JSON.stringify(source)}
    document.head.appendChild(style)
    `
    return style
}
module.exports = loader;