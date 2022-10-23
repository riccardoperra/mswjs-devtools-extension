import { createMessenger, GenericMessage } from "../shared/messanger";
import { MswDevtoolsEventData } from "../shared/messages";

/**
 * Handle communication messages from both bridge and devtools.
 * - Messages with source "mswjs-bridge" will be received from window.addEventListener
 * - Messages with source "mswjs-devtools" will be received from chrome.runtime.listener
 *
 * All dispatched messages with receiver "bridge" will be sent to bridge.
 * ALl dispatched messages with receiver "devtools" will be sent to devtools
 */
export const contentMessenger = createMessenger<MswDevtoolsEventData>(
  (data) => {
    if (data.receiver === "bridge") {
      window.postMessage(data, "*");
    } else {
      chrome.runtime.sendMessage(data);
    }
  },
  (callback, sender) => {
    function handler(
      event: MessageEvent<Partial<GenericMessage<MswDevtoolsEventData>>>
    ) {
      const { data, source } = event;
      if (
        source === window &&
        (!data.hasOwnProperty("type") ||
          !data.hasOwnProperty("source") ||
          data.source !== "mswjs-bridge")
      ) {
        return;
      }
      callback(data as GenericMessage<MswDevtoolsEventData>);
    }

    const handlerChrome = (
      event: Partial<GenericMessage<MswDevtoolsEventData>>
    ) => {
      if (
        !event.hasOwnProperty("type") ||
        !event.hasOwnProperty("source") ||
        event.source !== "mswjs-devtools"
      ) {
        return;
      }
      callback(event as GenericMessage<MswDevtoolsEventData>);
    };

    if (sender === "bridge") {
      addEventListener("message", handler);
      return () => removeEventListener("message", handler);
    }
    if (sender === "devtools") {
      chrome.runtime.onMessage.addListener(handlerChrome);
      return () => chrome.runtime.onMessage.removeListener(handlerChrome);
    }
    return () => {};
  },
  "content-script"
);

console.log(contentMessenger);
