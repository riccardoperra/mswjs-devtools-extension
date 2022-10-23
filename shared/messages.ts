// export interface MswPublicEvents {
//   init: void;
//   start: void;
//   stop: void;
// }

import { StartOptions } from "msw";

export type MswDevtoolsEventData = {
  BRIDGE_MSW_START: { options: StartOptions | undefined };
  BRIDGE_MSW_STOP: void;
  BRIDGE_MSW_INIT: { handlers: any[]; initialized: boolean };
  BRIDGE_MSW_UPDATE_HANDLERS: { handlers: any[]; initialized: boolean };

  DEVTOOLS_MSW_START: void;
  DEVTOOLS_MSW_STOP: void;
  DEVTOOLS_MOUNT: void;
  DEVTOOLS_UPDATE_MOCK: { id: number; skip: boolean };
};
