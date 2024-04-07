import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { name } from "../../package.json";
const root = document.createElement("div");
root.id = name.replaceAll(" ", "-").toLocaleLowerCase();
ReactDOM.createRoot(root).render(React.createElement(React.StrictMode, null,
    React.createElement(App, { rootId: root.id })));
document.querySelector("body")?.append(root);
//# sourceMappingURL=main.js.map