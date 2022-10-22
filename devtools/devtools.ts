let panel: chrome.devtools.panels.ExtensionPanel | undefined;

try {
  panel = await createPanel();
} catch (error) {
  console.error(error);
}

function createPanel() {
  return new Promise<chrome.devtools.panels.ExtensionPanel>(
    (resolve, reject) => {
      chrome.devtools.panels.create(
        "MSWJS",
        "assets/icons/solid-normal-32.png",
        "index.html",
        (newPanel) => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
          else resolve(newPanel);
        }
      );
    }
  );
}
