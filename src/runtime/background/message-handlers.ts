import { ExtensionMessage } from "runtime/services/extension/messages";
import { infoLog } from "runtime/services/log";
import { isExtensionMessage } from "shared/message";

export async function backgroundRuntimeHandler(
  message: ExtensionMessage,
  port: chrome.runtime.Port
) {
  if (!isExtensionMessage(message)) {
    return true;
  }

  console.log(infoLog([`${port.name}: received message:`, message]));

  return true;
}
