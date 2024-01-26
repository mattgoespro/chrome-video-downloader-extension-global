import { log } from "runtime/services/utils";
import { backgroundRuntimeHandler } from "./message-handlers";

const ServiceWorkerActiveUrls: RegExp[] = [
  new RegExp(/^https:\/\/\S+\/video[s]\/\S+$/),
  new RegExp(/^https:\/\/\S+\/watch\/\S+$/),
  new RegExp(/^https:\/\/\S+\/embed\/\S+$/)
];

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) =>
    log({
      type: "fatal",
      message: ["Unable to set extension panel behavior."],
      error
    })
  );
});

const ContextMenuItems: Record<string, chrome.contextMenus.CreateProperties> = {
  "download-video-now": {
    id: "download-video-now",
    title: "Download Video..."
  },
  "download-video-now-as": {
    id: "download-video-now-as",
    title: "Download Video as..."
  }
};

chrome.contextMenus.create({
  id: ContextMenuItems["download-video-now"].id,
  title: ContextMenuItems["download-video-now"].title,
  contexts: ["action"]
});

chrome.contextMenus.create({
  id: ContextMenuItems["download-video-now-as"].id,
  title: ContextMenuItems["download-video-now-as"].title,
  contexts: ["action"]
});

chrome.contextMenus.onClicked.addListener((info, _tab) => {
  switch (info.menuItemId) {
    case ContextMenuItems["download-video-now"].id: {
      // TODO: Implement.
      break;
    }
    case ContextMenuItems["download-video-now-as"].id: {
      // TODO: Implement.
      break;
    }
    default: {
      throw new Error(`Unhandled context menu item id '${info.menuItemId}'.`);
    }
  }
});

chrome.tabs.onHighlighted.addListener(async (highlightInfo) => {
  log({ message: ["Tab highlighted:", highlightInfo] });
  const tabId = highlightInfo.tabIds[0];

  chrome.tabs.get(tabId, async (tab) => {
    if (tab.id !== tabId) {
      log({
        message: ["Unable to get tab details."]
      });
      return;
    }

    log({ message: ["Tab details:", tab] });
    if (
      !ServiceWorkerActiveUrls.some((url) => {
        console.log(url);
        console.log(tab.url);
        console.log(url.exec(tab.url));
        return url.test(tab.url);
      })
    ) {
      console.log("Disabling menu items");
      log({
        type: "info",
        message: ["Service worker inactive for URL:", tab.url ?? "Chrome"]
      });
      await toggleContextMenuItems({ enabled: false });
      return;
    }

    const port = chrome.tabs.connect(tabId);

    port.onMessage.addListener(backgroundRuntimeHandler);

    // chrome.webNavigation.onCompleted.addListener(handleWebNavigationMessage);
  });
});

async function toggleContextMenuItems(options: { enabled: boolean }): Promise<void> {
  const toggleMenuItem = (menuItemId: string, enabled: boolean) => {
    return new Promise<void>((resolve) => {
      chrome.contextMenus.update(menuItemId, { enabled }, () => resolve());
    });
  };

  for (const [name, menuItem] of Object.entries(ContextMenuItems)) {
    await toggleMenuItem(menuItem.id, options.enabled ?? true);
    log({
      message: [`Context menu item '${name}' ${options.enabled ? "enabled" : "disabled"}.`]
    });
  }
}

// export async function handleWebNavigationMessage(
//   details: chrome.webNavigation.WebNavigationFramedCallbackDetails
// ): Promise<void> {
//   if (details.frameType === "sub_frame" && details.url.includes("embed")) {
//     console.log("Scraping video details from page...");
//     return new Promise<void>((resolve, reject) => {
//       const target = { tabId: details.tabId, frameIds: [details.frameId] };

//       chrome.scripting
//         .executeScript({
//           target,
//           func: scrapeVideoDetailsFromPage
//         })
//         .then(([injectionResult]) => {
//           const videoDetails = injectionResult.result;

//           log({
//             type: "info",
//             message: [`Video details scraped from page:`, videoDetails]
//           });

//           chrome.runtime.sendMessage<VideoDetailsScrapedMessage>({
//             type: "extensionMessage",
//             subject: "videoDetailsScraped",
//             payload: videoDetails
//           });
//           resolve();
//         })
//         .catch((error) => {
//           log({
//             type: "warn",
//             message: "Unable to inject script into page.",
//             error
//           });
//           reject(error);
//         });
//     });
//   }
// }
