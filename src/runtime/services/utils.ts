import { infoLog } from "./log";

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

export const BackgroundActiveUrls = [new RegExp(/^https:\/\/.*$/g)] as const;

export function withUrlValidation<T = unknown>(tabUrl: string, fn: () => T) {
  if (
    !BackgroundActiveUrls.some((url) => {
      return url.test(tabUrl);
    })
  ) {
    console.log(infoLog(["Background script inactive for URL:", tabUrl ?? "Chrome"]));
    return;
  }

  return fn();
}
