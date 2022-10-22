import { MswDevtoolsExtension } from "./shared/extension";

declare const __MSWJS_DEVTOOLS_EXTENSION: MswDevtoolsExtension;

declare global {
  interface Window {
    __MSWJS_DEVTOOLS_EXTENSION: MswDevtoolsExtension;
  }
}
