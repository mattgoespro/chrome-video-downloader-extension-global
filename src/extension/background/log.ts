import { LogMessage } from "video-downloader/messages";

export function consoleLog(message: string, ...args: unknown[]): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    if (!activeTab?.id) {
      return;
    }

    chrome.tabs.sendMessage<LogMessage>(activeTab.id, {
      subject: "logMessage",
      type: "extensionMessage",
      payload: { message, args }
    });
  });
}
