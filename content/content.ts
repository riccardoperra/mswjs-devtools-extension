var tabId: string;

window.addEventListener("message", (event) => {
  if (
    event.source === window &&
    event.data &&
    event.data.source === "mswjs-script"
  ) {
    chrome.runtime.sendMessage(event.data);
  }
});

chrome.runtime.onMessage.addListener((event) => {
  if (event.type && event.source === "mswjs-app") {
    switch (event.type) {
      case "MSW_START": {
        postMessage(
          {
            type: "MSW_START",
            source: "mswjs-content",
          },
          "*"
        );
        break;
      }
      case "MSW_STOP": {
        postMessage(
          {
            type: "MSW_STOP",
            source: "mswjs-content",
          },
          "*"
        );
        break;
      }
      case "MSW_INIT": {
        postMessage(
          {
            type: "MSW_INIT",
            source: "mswjs-content",
          },
          "*"
        );
        break;
      }
      case "MSW_MOCK_UPDATE": {
        postMessage(
          {
            type: "MSW_MOCK_UPDATE",
            source: "mswjs-content",
            payload: event.payload,
          },
          "*"
        );
        break;
      }
    }
  }
});

const src = chrome.runtime.getURL(`inject.js`);
const scriptElement = document.createElement("script");
scriptElement.src = src;
document.body.append(scriptElement);

export {};
