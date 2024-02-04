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
  const LOG_PREFIX = "[Video Downloader Global] ";

  const combinedLogString: string[] = [LOG_PREFIX];

  if (typeof message === "string") {
    return `${LOG_PREFIX} ${message}`;
  } else if (Array.isArray(message)) {
    let logStringSequence = [];

    for (let i = 0; i < message.length; i++) {
      const logObject = message[i];

      switch (typeof logObject) {
        case "string":
          logStringSequence.push(logObject);
          continue;
        case "object": {
          let objString = "null";

          if (logObject != null) {
            objString = JSON.stringify(logObject, null, 2);
          }

          combinedLogString.push(logStringSequence.join(" "), "\n", objString);
          logStringSequence = [];
          break;
        }
      }
    }

    if (logStringSequence.length > 0) {
      combinedLogString.push(logStringSequence.join(" "));
    }
  } else {
    combinedLogString.push("\n", JSON.stringify(message, null, 2));
  }

  if (error != null) {
    combinedLogString.push("\n\n", JSON.stringify(error, null, 2));
  }

  return combinedLogString.join("");
}

export function infoLog(message: LogMessage): string {
  return logObjectToString(message);
}

export function warnLog(message: LogMessage, error?: Error): string {
  return logObjectToString(message, error);
}

export function errorLog(message: LogMessage, error: Error): string {
  return logObjectToString(message, error);
}
