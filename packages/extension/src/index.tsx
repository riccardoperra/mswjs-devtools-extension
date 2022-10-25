import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { ErrorBoundary } from "solid-js";

render(
  () => (
    <ErrorBoundary fallback={(e) => <div>{e}</div>}>
      <App />
    </ErrorBoundary>
  ),
  document.getElementById("root") as HTMLElement
);
