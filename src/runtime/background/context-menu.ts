import { infoLog } from "runtime/services/log";

export const ContextMenuItems: Record<string, chrome.contextMenus.CreateProperties> = {
  "Example Context Menu Item": {
    id: "example-context-menu-item",
    title: "Example Context Menu Item",
    contexts: ["action"]
  }
};

export async function createMenuItems() {
  return new Promise<string[]>((resolve) => {
    const menuItemsCreated: string[] = [];

    Object.values(ContextMenuItems).forEach((menuItem) => {
      chrome.contextMenus.create(menuItem, () => {
        console.log(infoLog(["Context menu item created: ", menuItem.title]));
        menuItemsCreated.push(menuItem.id);
      });
    });
    resolve(menuItemsCreated);
  });
}

export async function toggleContextMenuItems(options: { enabled: boolean }): Promise<void> {
  const toggleMenuItem = (menuItemId: string) => {
    return new Promise<void>((resolve) => {
      chrome.contextMenus.update(menuItemId, { enabled: options.enabled }, () => resolve());
    });
  };

  for (const [name, menuItem] of Object.entries(ContextMenuItems)) {
    await toggleMenuItem(menuItem.id);
    console.log(
      infoLog([`Context menu item '${name}' ${options.enabled ? "enabled" : "disabled"}.`])
    );
  }
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log(infoLog(["Context menu item clicked:", info.menuItemId, tab]));
});
