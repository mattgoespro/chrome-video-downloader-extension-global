import { ExtensionMessage } from "runtime/services/extension/messages";
import { infoLog, warnLog } from "runtime/services/log";
import { isExtensionMessage } from "shared/message";

export async function contentScriptRuntimeHandler(
  message: ExtensionMessage,
  port: chrome.runtime.Port
) {
  if (!isExtensionMessage(message)) {
    console.log(
      warnLog({
        message: ["Skipping handling of non-extension message", message]
      })
    );
    return true;
  }

  console.log(infoLog([`${port.name}: received message:`, message]));

  return true;
}
