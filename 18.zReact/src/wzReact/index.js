function createElement(type, props, ...children) {
  console.log("createElement", arguments);
  props.children = children;
  let vtype;
  if (typeof type === "string") {
    vtype = 1;
  }
  if (typeof type === "function") {
    vtype = type.isReactComponent ? 2 : 3;
  }
  return {
    vtype,
    type,
    props,
  };
}

class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
  }
  setState = () => {};
}

export default {
  Component,
  createElement,
};
