chrome.runtime.onInstalled.addListener(() => {
  // First, remove any existing context menu items
  chrome.contextMenus.removeAll(() => {
    // Define the services array
    const services = [
      { id: "youglish", title: "YouGlish", url: "https://youglish.com/pronounce/%s/german" },
      { id: "playphrase", title: "Playphrase", url: "https://de.playphrase.me/#/search?language=de&q=%s" },
      { id: "verbformen", title: "Verbformen", url: "https://www.verbformen.com/conjugation/%s.htm" },
      { id: "linguee", title: "Linguee", url: "https://www.linguee.com/english-german/search?source=auto&query=%s" },
      { id: "forvo", title: "Forvo", url: "https://forvo.com/word/%s/#it" }
    ];

    // Create the parent menu item
    chrome.contextMenus.create({
      id: "langLink",
      title: "LangLink",
      contexts: ["selection"]
    });

    // Create child menu items
    services.forEach(service => {
      chrome.contextMenus.create({
        id: service.id,
        parentId: "langLink",
        title: service.title,
        contexts: ["selection"]
      });
    });
  });
});

// Move the event listener outside the onInstalled listener
// to ensure it's only registered once
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // Define services again or use a more persistent storage method
  const services = [
    { id: "youglish", title: "YouGlish", url: "https://youglish.com/pronounce/%s/german" },
    { id: "playphrase", title: "Playphrase", url: "https://de.playphrase.me/#/search?language=de&q=%s" },
    { id: "verbformen", title: "Verbformen", url: "https://www.verbformen.com/conjugation/%s.htm" },
    { id: "linguee", title: "Linguee", url: "https://www.linguee.com/english-german/search?source=auto&query=%s" },
    { id: "forvo", title: "Forvo", url: "https://forvo.com/word/%s/#it" }
  ];
  
  const service = services.find(s => s.id === info.menuItemId);
  if (service) {
    const query = encodeURIComponent(info.selectionText);
    const url = service.url.replace("%s", query);
    chrome.tabs.create({ url: url });
  }
});