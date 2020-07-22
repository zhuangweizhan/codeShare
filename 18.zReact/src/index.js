import React from "./wzReact/";
import ReactDOM from "./wzReact/ReactDOM";

class MyClassCmp extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div className="class_2" >MyClassCmp表示:{this.props.name}</div>
    );
  }
  
}

function MyFuncCmp(props) {
  return <div className="class_1" >MyFuncCmp表示:{props.name}</div>;
}


let jsx = (
  <div>
    <h1>你好</h1>
    <div className="class_0">前端小伙子</div>
    <MyFuncCmp name="真帅" />
    <MyClassCmp name="还有钱" />
  </div>
);


ReactDOM.render(jsx, document.getElementById("root"));
