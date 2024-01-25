import { isExtensionMessage } from "shared/message";
import { ScriptSyncMessage, VideoMessage } from "./extension/messages";

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

export async function messageContentScript<
  Message extends VideoMessage,
  Response extends VideoMessage
>(message: Message, tabId?: number): Promise<Response> {
  return new Promise<Response>((resolve, reject) => {
    if (tabId != null) {
      syncScripts(tabId)
        .then(() => {
          resolve(messageContentScriptWithTabId(message, tabId));
        })
        .catch((error) => {
          reject(new Error(`Failed to sync service worker with content script: ${error.message}`));
        });
    }

    getActiveTabId()
      .then((tabId) => {
        chrome.tabs;
        syncScripts(tabId)
          .then(() => {
            chrome.tabs.sendMessage<Message, Response>(tabId, message).then((response) => {
              if (response == null) {
                reject(new Error("Failed to send message to content script: no response"));
              }

              if (isExtensionMessage(response)) {
                resolve(response);
              }
            });
          })
          .catch((error) => {
            reject(
              new Error(`Failed to sync service worker with content script: ${error.message}`)
            );
          });
      })
      .catch((error) => {
        reject(new Error(`Failed to query active tab: ${error.message}`));
      });
  });
}

async function messageContentScriptWithTabId<
  Message extends VideoMessage,
  Response extends VideoMessage
>(message: Message, tabId: number): Promise<Response> {
  return new Promise<Response>((resolve, reject) => {
    chrome.tabs.sendMessage<Message, Response>(tabId, message).then((response) => {
      if (response == null) {
        reject(new Error("Failed to send message to content script: no response"));
      }

      if (isExtensionMessage(response)) {
        resolve(response);
      }
    });
  });
}

async function syncScripts(tabId: number) {
  return new Promise<void>((resolve, reject) => {
    chrome.tabs
      .sendMessage<ScriptSyncMessage>(tabId, {
        type: "extensionMessage",
        subject: "sync"
      })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}
const LOG_PREFIX = "[Video Downloader Global]";
type LogMessage = string | object | (string | object)[];
type LogOptions = {
  type?: "info" | "warn" | "fatal";
  message?: LogMessage;
  error?: Error;
};

export function log(options: LogOptions | string): void {
  const { message, type, error } =
    typeof options === "string" ? { message: [options], type: "info", error: null } : options;

  let logFn = console.log;

  switch (type) {
    case "info":
      logFn = console.info;
      break;
    case "warn":
      logFn = console.warn;
      break;
    case "fatal":
      logFn = console.error;
      break;
  }
  const logLines = [LOG_PREFIX];

  if (message != null) {
    if (Array.isArray(message)) {
      logLines.push(...message);
    } else {
      logLines.push(JSON.stringify(message));
    }
  }

  if (error != null) {
    logLines.push(["\n", "\n", error].join(""));
  }

  logFn(logLines.join(" "));
}
