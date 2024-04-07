import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { name } from "../../package.json";

const root: HTMLElement | null = document.createElement("div")!;
root.id = name.replaceAll(" ", "-").toLocaleLowerCase();

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App rootId={root.id} />
  </React.StrictMode>
);

document.querySelector("body")?.append(root);
