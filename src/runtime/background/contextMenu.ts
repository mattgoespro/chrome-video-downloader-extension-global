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
