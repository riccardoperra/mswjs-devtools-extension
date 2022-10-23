import { contentMessenger } from "./contentMessenger";

contentMessenger.on(
  "DEVTOOLS_MSW_START",
  (event) => {
    console.log("TESTING MSW", event);
    contentMessenger.dispatch("DEVTOOLS_MSW_START", undefined, "bridge");
  },
  "devtools"
);

contentMessenger.on(
  "DEVTOOLS_MSW_STOP",
  (event) => {
    console.log("TESTING MSW STOP", event);
    contentMessenger.dispatch("DEVTOOLS_MSW_STOP", undefined, "bridge");
  },
  "devtools"
);

contentMessenger.on(
  "DEVTOOLS_MOUNT",
  (data) => {
    contentMessenger.dispatch("DEVTOOLS_MOUNT", data.payload, "bridge");
  },
  "devtools"
);

contentMessenger.on(
  "DEVTOOLS_UPDATE_MOCK",
  (data) => {
    contentMessenger.dispatch("DEVTOOLS_UPDATE_MOCK", data.payload, "bridge");
  },
  "devtools"
);

contentMessenger.on(
  "*",
  (event) => {
    contentMessenger.dispatch(event.type, event.payload, "devtools");
  },
  "bridge"
);

const src = chrome.runtime.getURL(`bridge/bridge.ts.js`);
const scriptElement = document.createElement("script");
scriptElement.src = src;
scriptElement.type = "module";
document.body.append(scriptElement);

export {};
