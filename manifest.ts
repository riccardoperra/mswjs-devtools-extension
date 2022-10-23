import { defineManifest } from "@crxjs/vite-plugin";
import { version } from "./package.json";

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);

export default defineManifest((env) => ({
  manifest_version: 3,
  name: `${env.mode === "production" ? "" : "[DEV] "}MSWJS Devtools`,
  description:
    "Chrome Developer Tools extension for debugging MockServiceWorker.",
  homepage_url: "https://github.com/riccardoperra/mswjs-devtools-extension",
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  author: "Riccardo Perra",
  minimum_chrome_version: "94",
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self'",
  },
  devtools_page: "devtools/devtools.html",
  content_scripts: [
    {
      matches: ["*://*/*"],
      js: ["content/content.ts"],
      run_at: "document_start",
    },
    {
      matches: ["*://*/*"],
      js: ["bridge/bridge.ts"],
    },
  ],
  externally_connectable: {
    ids: ["*"],
    matches: ["*://*/*"],
    accepts_tls_channel_id: false,
  },
  background: {
    service_worker: "background/background.ts",
    type: "module",
    persistent: true,
  },

  permissions: ["scripting", "activeTab"],
  // action: {
  //   default_icon: {
  //     '16': 'assets/icons/solid-gray-16.png',
  //     '32': 'assets/icons/solid-gray-32.png',
  //     '48': 'assets/icons/solid-gray-48.png',
  //     '128': 'assets/icons/solid-gray-128.png',
  //   },
  //   default_title: 'Solid Devtools',
  // },
  // icons: {
  //   '16': 'assets/icons/solid-normal-16.png',
  //   '32': 'assets/icons/solid-normal-32.png',
  //   '48': 'assets/icons/solid-normal-48.png',
  //   '128': 'assets/icons/solid-normal-128.png',
  // },
}));
