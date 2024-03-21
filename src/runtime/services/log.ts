type LogMessage = string | number | boolean | object | (string | number | boolean | object)[];

function logObjectToString(
  type: "info" | "warn" | "error",
  message: LogMessage,
  error?: Error
): string {
  const LOG_PREFIX = "[Video Downloader Global]";
  const LOG_TYPE = type.toUpperCase();

  const combinedLogString = [];

  if (Array.isArray(message)) {
    let logStringSequence = [`${LOG_PREFIX} ${LOG_TYPE}:\n`];

    for (let i = 0; i < message.length; i++) {
      const logLine = message[i];

      switch (typeof logLine) {
        case "string":
          logStringSequence.push(logLine);
          break;
        case "object":
          combinedLogString.push(logStringSequence.join(" "), "\n");
          logStringSequence = [`${LOG_PREFIX} ${LOG_TYPE}: ${logLine}\n`];
          break;
      }
    }
    combinedLogString.push(logStringSequence.join(""));
  } else {
    combinedLogString.push(LOG_PREFIX, LOG_TYPE, ":", message);
    combinedLogString.push(message);
  }

  if (error != null) {
    combinedLogString.push("\n\n", error);
  }

  return combinedLogString.join();
}

export function infoLog(message: LogMessage): string {
  return logObjectToString("info", message);
}

export function warnLog(message: LogMessage, error?: Error): string {
  return logObjectToString("warn", message, error);
}

export function errorLog(message: LogMessage, error: Error): string {
  return logObjectToString("error", message, error);
}
