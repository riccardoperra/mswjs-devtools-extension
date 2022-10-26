import { createMessenger, GenericMessage } from "../shared/messanger";
import { type MswDevtoolsEventData } from "@mswjs-devtools/shared";

/**
 * Handle communication messages to Devtools received from content-script.
 * All dispatched messages will be sent to content-script
 */
export const devtoolsMessenger = createMessenger<MswDevtoolsEventData>(
  (data) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id as number, data);
      }
    );
  },
  (callback) => {
    const handler = (event: Partial<GenericMessage<MswDevtoolsEventData>>) => {
      if (!event.hasOwnProperty("type") || !event.hasOwnProperty("source")) {
        return;
      }
      callback(event as GenericMessage<MswDevtoolsEventData>);
    };

    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  },
  "devtools"
);
