// Define base service configurations
const baseServices = [
  {
    id: "youglish",
    title: "YouGlish",
    urlTemplates: {
      de: "https://youglish.com/pronounce/%s/german",
      fr: "https://youglish.com/pronounce/%s/french",
      es: "https://youglish.com/pronounce/%s/spanish",
      it: "https://youglish.com/pronounce/%s/italian",
      zh: "https://youglish.com/pronounce/%s/chinese",
      default: "https://youglish.com/pronounce/%s/english"
    }
  },
  {
    id: "playphrase",
    title: "Playphrase",
    urlTemplates: {
      de: "https://de.playphrase.me/#/search?language=de&q=%s",
      fr: "https://fr.playphrase.me/#/search?language=fr&q=%s",
      es: "https://es.playphrase.me/#/search?language=es&q=%s",
      it: "https://it.playphrase.me/#/search?language=it&q=%s",
      default: "https://playphrase.me/#/search?q=%s"
    }
  },
  {
    id: "verbformen",
    title: "Verbformen",
    urlTemplates: {
      de: "https://www.verbformen.com/conjugation/%s.htm",
      fr: "https://www.verbformen.com/conjugation/french/%s.htm",
      es: "https://www.verbformen.com/conjugation/spanish/%s.htm",
      it: "https://www.verbformen.com/conjugation/italian/%s.htm",
      default: "https://www.verbformen.com/conjugation/%s.htm"
    }
  },
  {
    id: "linguee",
    title: "Linguee",
    urlTemplates: {
      de: "https://www.linguee.com/english-german/search?source=auto&query=%s",
      fr: "https://www.linguee.com/english-french/search?source=auto&query=%s",
      es: "https://www.linguee.com/english-spanish/search?source=auto&query=%s",
      it: "https://www.linguee.com/english-italian/search?source=auto&query=%s",
      zh: "https://www.linguee.com/english-chinese/search?source=auto&query=%s",
      default: "https://www.linguee.com/english-german/search?source=auto&query=%s"
    }
  },
  {
    id: "forvo",
    title: "Forvo",
    urlTemplates: {
      de: "https://forvo.com/word/%s/#de",
      fr: "https://forvo.com/word/%s/#fr",
      es: "https://forvo.com/word/%s/#es",
      it: "https://forvo.com/word/%s/#it",
      zh: "https://forvo.com/word/%s/#zh",
      default: "https://forvo.com/word/%s"
    }
  },
  {
    id: "googleTranslate",
    title: "Google Translate",
    urlTemplates: {
      de: "https://translate.google.com/?sl=auto&tl=de&text=%s&op=translate",
      fr: "https://translate.google.com/?sl=auto&tl=fr&text=%s&op=translate",
      es: "https://translate.google.com/?sl=auto&tl=es&text=%s&op=translate",
      it: "https://translate.google.com/?sl=auto&tl=it&text=%s&op=translate",
      zh: "https://translate.google.com/?sl=auto&tl=zh-CN&text=%s&op=translate",
      default: "https://translate.google.com/?sl=auto&tl=en&text=%s&op=translate"
    }
  }
];

// Function to get services with URLs for the current language
async function getServices() {
  // Get the language preference or use default
  return new Promise((resolve) => {
    chrome.storage.sync.get(['selectedLanguage'], (result) => {
      const language = result.selectedLanguage || 'en'; // Default to English if not set
      
      // Map services to include the correct URL for the selected language
      const services = baseServices.map(service => ({
        id: service.id,
        title: service.title,
        url: service.urlTemplates[language] || service.urlTemplates.default
      }));
      
      resolve(services);
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  // First, remove any existing context menu items
  chrome.contextMenus.removeAll(async () => {
    // Create the parent menu item
    chrome.contextMenus.create({
      id: "langLink",
      title: "LangLink",
      contexts: ["selection"]
    });

    // Get services with URLs for the current language
    const services = await getServices();

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

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  // Get services with URLs for the current language
  const services = await getServices();
  
  // Find the clicked service
  const service = services.find(s => s.id === info.menuItemId);
  
  if (service) {
    const query = encodeURIComponent(info.selectionText);
    const url = service.url.replace("%s", query);
    chrome.tabs.create({ url: url });
  }
});

// Listen for language change in storage
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.selectedLanguage) {
    // Recreate context menu items with updated URLs
    chrome.contextMenus.removeAll(async () => {
      // Create the parent menu item
      chrome.contextMenus.create({
        id: "langLink",
        title: "LangLink",
        contexts: ["selection"]
      });

      // Get services with URLs for the current language
      const services = await getServices();

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
  }
});
chrome.runtime.onInstalled.addListener(() => {
  // First, remove any existing context menu items
  chrome.contextMenus.removeAll(() => {
    // Define the services array
    const services = [
      { id: "youglish", title: "YouGlish", url: "https://youglish.com/pronounce/%s/german" },
      { id: "playphrase", title: "Playphrase", url: "https://de.playphrase.me/#/search?language=de&q=%s" },
      { id: "verbformen", title: "Verbformen", url: "https://www.verbformen.com/conjugation/%s.htm" },
      { id: "linguee", title: "Linguee", url: "https://www.linguee.com/english-german/search?source=auto&query=%s" },
      { id: "forvo", title: "Forvo", url: "https://forvo.com/word/%s/#it" },
      { id: "googleTranslate", title: "Google Translate", url: "https://translate.google.com/?sl=auto&tl=en&text=%s&op=translate" }
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
  // Define services with placeholders for language
  const services = [
    { id: "youglish", title: "YouGlish", url: "https://youglish.com/pronounce/%s/%lang" },
    { id: "playphrase", title: "Playphrase", url: "https://%lang.playphrase.me/#/search?language=%lang&q=%s" },
    { id: "verbformen", title: "Verbformen", url: "https://www.verbformen.com/conjugation/%s.htm" },
    { id: "linguee", title: "Linguee", url: "https://www.linguee.com/%lang-english/search?source=auto&query=%s" },
    { id: "forvo", title: "Forvo", url: "https://forvo.com/word/%s/#%lang" },
    { id: "googleTranslate", title: "Google Translate", url: "https://translate.google.com/?sl=auto&tl=%lang&text=%s&op=translate" }
  ];

  // Get the selected language from storage
  chrome.storage.sync.get('selectedLanguage', (data) => {
    const selectedLanguage = data.selectedLanguage || 'en'; // Default to English if not set
    const service = services.find(s => s.id === info.menuItemId);
    if (service) {
      const query = encodeURIComponent(info.selectionText);
      const url = service.url.replace("%s", query).replace(/%lang/g, selectedLanguage);
      chrome.tabs.create({ url: url });
    }
  });
});