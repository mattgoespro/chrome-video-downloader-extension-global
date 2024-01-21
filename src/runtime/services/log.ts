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
    console.log(["\n", "\n", error]);
    console.log(["\n", "\n", error].join(""));
  }

  logFn(logLines.join(""));
}
