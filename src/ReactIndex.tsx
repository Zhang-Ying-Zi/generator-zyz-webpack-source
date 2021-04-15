import * as React from 'react';
import * as ReactDOM from "react-dom";

import App from './ReactApp';

var mountNode = document.getElementById("reactroot");
ReactDOM.render(<App name="React " />, mountNode);