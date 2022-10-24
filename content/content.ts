import { contentMessenger } from "./contentMessenger";
import bridge from "../bridge/bridge?script&module";

contentMessenger.on(
  "DEVTOOLS_MSW_START",
  () => {
    contentMessenger.dispatch("DEVTOOLS_MSW_START", undefined, "bridge");
  },
  "devtools"
);

contentMessenger.on(
  "DEVTOOLS_MSW_STOP",
  () => {
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
  "DEVTOOLS_UPDATE_ROUTE",
  (data) => {
    contentMessenger.dispatch("DEVTOOLS_UPDATE_ROUTE", data.payload, "bridge");
  },
  "devtools"
);

contentMessenger.on(
  "DEVTOOLS_UPDATE_MOCK_CONFIGURATION",
  (data) => {
    contentMessenger.dispatch(
      "DEVTOOLS_UPDATE_MOCK_CONFIGURATION",
      data.payload,
      "bridge"
    );
  },
  "devtools"
);

contentMessenger.on(
  "DEVTOOLS_CREATE_HANDLER",
  ({ payload }) => {
    contentMessenger.dispatch("DEVTOOLS_CREATE_HANDLER", payload, "bridge");
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

const script = document.createElement("script");
script.src = chrome.runtime.getURL(bridge);
script.type = "module";
script.addEventListener("load", () => {
  console.log("script loaded");
});
script.addEventListener("error", (err) => {
  console.error(err);
});

document.head.append(script);

export {};
