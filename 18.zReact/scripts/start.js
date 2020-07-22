import React, { Component } from "react";
import ReactDOM from "react-dom";


class ClassCmp extends Component {
  constructor(props) {
    super(props);
    alert("ggg");
  }
  
  render() {
    return (
      <div className="border">
          111
      </div>
    );
  }
}

// export default ClassCmp;



ReactDOM.render(ClassCmp, document.getElementById("root"));
