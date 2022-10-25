import { render } from "solid-js/web";

import "./index.css";
import { App } from "./src/App";
import { ErrorBoundary } from "solid-js";

render(() => <App />, document.getElementById("root") as HTMLElement);
