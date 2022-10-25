import { MswDevtoolsEventData } from "../shared/messages";
import { createMessenger, GenericMessage, Message } from "../shared/messanger";

/**
 * Handle communication messages to Bridge received from content-script.
 * All dispatched messages will be sent to content-script
 */
export const bridgeMessenger = createMessenger<MswDevtoolsEventData>(
  (data) => postMessage(data, "*"),
  (callback) => {
    function handler(
      event: MessageEvent<Partial<GenericMessage<MswDevtoolsEventData>>>
    ) {
      const { data } = event;
      if (
        !data.type ||
        !data.source ||
        data.source !== "mswjs-content-script"
      ) {
        return;
      }
      callback(data as GenericMessage<MswDevtoolsEventData>);
    }

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  },
  "bridge"
);
