import { errorLog, infoLog } from "runtime/services/utils";
import { backgroundRuntimeHandler } from "./message-handlers";

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.info(errorLog("Unable to set extension panel behavior.", error)));

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

chrome.contextMenus.removeAll(() => {
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
});

const ServiceWorkerActiveUrls = [
  new RegExp(/^https:\/\/\S+\/video[s]\/\S+$/),
  new RegExp(/^https:\/\/\S+\/watch\/\S+$/),
  new RegExp(/^https:\/\/\S+\/embed\/\S+$/)
] as const;

function withUrlValidation(tabUrl: string, fn: () => unknown) {
  if (
    !ServiceWorkerActiveUrls.some((url) => {
      return url.test(tabUrl);
    })
  ) {
    console.log(infoLog(["Service worker inactive for URL:", tabUrl ?? "Chrome"]));
    return;
  }

  return fn();
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") {
    console.log(infoLog("Waiting for tab to load..."));
    return;
  }

  withUrlValidation(tab.url, async () => {
    await toggleContextMenuItems({ enabled: false });
  });
});

chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") {
    console.log(infoLog("Waiting for tab to load..."));
    return;
  }

  withUrlValidation(tab.url, async () => {
    chrome.runtime.onConnect.addListener((port) => {
      console.log(
        infoLog([
          "Connection established in service worker:",
          port?.name ?? "Unrecognized port",
          "Sender:",
          port.sender
        ])
      );

      chrome.contextMenus.onClicked.addListener((event) =>
        contextMenuItemClickHandler(event, port)
      );

      port.onMessage.addListener(backgroundRuntimeHandler);
    });
  });
});

function contextMenuItemClickHandler(
  event: chrome.contextMenus.OnClickData,
  port: chrome.runtime.Port
) {
  switch (event.menuItemId) {
    case ContextMenuItems["download-video-now"].id: {
      port.postMessage({
        type: "extensionMessage",
        subject: "scrapeVideoDetails"
      });

      return true;
    }
    case ContextMenuItems["download-video-now-as"].id: {
      // TODO: Implement.
      break;
    }
    default: {
      throw new Error(`Unhandled context menu item id '${event.menuItemId}'.`);
    }
  }
}

async function toggleContextMenuItems(options: { enabled: boolean }): Promise<void> {
  const toggleMenuItem = (menuItemId: string, enabled: boolean) => {
    return new Promise<void>((resolve) => {
      chrome.contextMenus.update(menuItemId, { enabled }, () => resolve());
    });
  };

  for (const [name, menuItem] of Object.entries(ContextMenuItems)) {
    await toggleMenuItem(menuItem.id, options.enabled ?? true);
    console.log(
      infoLog([`Context menu item '${name}' ${options.enabled ? "enabled" : "disabled"}.`])
    );
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
