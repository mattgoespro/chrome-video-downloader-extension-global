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

type LogMessage = string | object | (string | object)[];

function logObjectToString(message: LogMessage, error?: Error): string {
  const LOG_PREFIX = "[Video Downloader Global]";

  const combinedLogString = [];

  if (Array.isArray(message)) {
    let logStringSequence = [LOG_PREFIX];

    for (let i = 0; i < message.length; i++) {
      const logLine = message[i];

      switch (typeof logLine) {
        case "string":
          logStringSequence.push(logLine);
          break;
        case "object":
          combinedLogString.push(logStringSequence.join(" "), "\n");
          logStringSequence = [LOG_PREFIX];
          break;
      }
    }
  } else {
    combinedLogString.push(LOG_PREFIX, message);
  }

  if (error != null) {
    combinedLogString.push("\n\n", error);
  }

  return combinedLogString.join("\n");
}

export function infoLog(message: LogMessage): string {
  return logObjectToString({ message });
}

export function warnLog(message: LogMessage, error?: Error): string {
  return logObjectToString({ message, error });
}

export function errorLog(message: LogMessage, error: Error): string {
  return logObjectToString({ message, error });
}
