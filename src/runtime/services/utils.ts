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

  if (message != null) {
    if (Array.isArray(message)) {
      let combinedLogString = [];

      for (let i = 0; i < message.length; i++) {
        const logLine = message[i];

        switch (typeof logLine) {
          case "string":
            combinedLogString.push(logLine);
            break;
          case "object":
            logFn(LOG_PREFIX, combinedLogString.join(" "));
            logFn(LOG_PREFIX, logLine);
            combinedLogString = [];
            break;
        }
      }
    } else {
      logFn(LOG_PREFIX, message);
    }
  }

  if (error != null) {
    logFn("\n\n", error);
  }
}
