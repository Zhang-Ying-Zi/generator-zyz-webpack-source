import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./ReactAppJS";

var mountNode = document.getElementById("reactrootJS");
ReactDOM.render(<App name="React" />, mountNode);
