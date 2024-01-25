import { log } from "runtime/services/utils";
import {
  backgroundRuntimeHandler,
  handleTabUpdatedMessage,
  handleWebNavigationMessage
} from "./message-handlers";

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) =>
  log({
    type: "fatal",
    message: ["Unable to set extension panel behavior."],
    error
  })
);

chrome.tabs.onUpdated.addListener(handleTabUpdatedMessage);

chrome.webNavigation.onCompleted.addListener(handleWebNavigationMessage);

chrome.runtime.onMessage.addListener(backgroundRuntimeHandler);
