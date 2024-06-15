type LogArgument = string | number | boolean | object | null | undefined;
type LogMessage = LogArgument | LogArgument[];
type LogLevel = "info" | "warn" | "error";

function logObject(logObject: object) {
  let objType = "Object";
  let logKeys = Object.keys(logObject);

  if (logObject instanceof Error) {
    objType = logObject.name ?? "Error";
    logKeys = ["message", "stack"];
  }

  return `${objType}({\n${logKeys.map((key) => `\t${key}: ${logObject[key] ?? "Not present"}`).join("\n")}\n})`;
}

function getMessageString(message: LogArgument) {
  switch (typeof message) {
    case "string":
    case "number":
    case "boolean":
      return message;
    case "object":
      return logObject(message);
    default:
      return "<unknown-type>";
  }
}

function logObjectToString(level: LogLevel, message: LogMessage, error?: Error): string {
  const LOG_PREFIX = "[chrome-extension-starter]";

  const combinedLogString = [];
  const messageParts = [LOG_PREFIX, `${level}:`];

  if (Array.isArray(message)) {
    for (let i = 0; i < message.length; i++) {
      messageParts.push(String(getMessageString(message[i])));
    }

    combinedLogString.push(messageParts.join(" "));
  } else {
    combinedLogString.push(LOG_PREFIX, `${level}:`, getMessageString(message));
  }

  if (error != null) {
    combinedLogString.push("\n", `${LOG_PREFIX} ${logObject(error)}`);
  }

  return combinedLogString.join(" ");
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
