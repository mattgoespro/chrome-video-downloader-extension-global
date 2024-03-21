export async function getActiveTabId(): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab == null) {
        reject(new Error("Unable to find active tab."));
      }

      resolve(tab.id);
    });
  });
}
