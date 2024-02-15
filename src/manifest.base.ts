export default {
  action: {
    default_icon: {
      "16": "assets/favicon-16x16.png",
      "32": "assets/favicon-32x32.png",
      "48": "assets/favicon-48x48.png"
    },
    default_title: "Click to view video..."
  },
  description: "Download videos from a web page.",
  host_permissions: ["https://*/*", "http://*/*"],
  icons: {
    "16": "assets/favicon-16x16.png",
    "32": "assets/favicon-32x32.png",
    "48": "assets/favicon-48x48.png"
  },
  manifest_version: 3,
  name: "Video Downloader",
  permissions: [
    "tabs",
    "scripting",
    "downloads",
    "sidePanel",
    "webRequest",
    "webNavigation",
    "contextMenus",
    "declarativeContent"
  ],
  short_name: "VDownload",
  version: "1.0"
};
