import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Test from "./test";

import "./index.css"; // Global styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <App />
      {/* <Test/> */}
  </React.StrictMode>
);