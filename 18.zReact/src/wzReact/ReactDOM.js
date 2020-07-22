function render(vnode, container) {
  console.log("render", vnode);
  //vnode-> node
  mount(vnode, container);
  // container.appendChild(node)
}
// vnode-> node
function mount(vnode, container) {
  const { vtype } = vnode;
  if (!vtype) {
    mountTextNode(vnode, container); //处理文本节点
  }
  if (vtype === 1) {
    mountHtml(vnode, container); //处理原生标签
  }

  if (vtype === 3) {
    //处理函数组件
    mountFunc(vnode, container);
  }

  if (vtype === 2) {
    //处理class组件
    mountClass(vnode, container);
  }
}

//处理文本节点
function mountTextNode(vnode, container) {
  const node = document.createTextNode(vnode);
  container.appendChild(node);
}

//处理原生标签
function mountHtml(vnode, container) {
  const { type, props } = vnode;
  const node = document.createElement(type);

  const { children, ...rest } = props;
  children.map(item => {
    if (Array.isArray(item)) {
      item.map(c => {
        mount(c, node);
      });
    } else {
      mount(item, node);
    }
  });

  Object.keys(rest).map(item => {
    if (item === "className") {
      node.setAttribute("class", rest[item]);
    }
    if (item.slice(0, 2) === "on") {
      node.addEventListener("click", rest[item]);
    }
  });

  container.appendChild(node);
}

function mountFunc(vnode, container) {
  const { type, props } = vnode;
  const node = new type(props);
  mount(node, container);
}

function mountClass(vnode, container) {
  const { type, props } = vnode;
  const cmp = new type(props);
  const node = cmp.render();
  mount(node, container);
}

export default {
  render,
};
