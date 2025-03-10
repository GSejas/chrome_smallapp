document.addEventListener('DOMContentLoaded', () => {
  const languageDropdown = document.getElementById('languageDropdown');

  // Load the saved language from storage
  chrome.storage.sync.get('selectedLanguage', (data) => {
    if (data.selectedLanguage) {
      languageDropdown.value = data.selectedLanguage;
    }
  });

  // Save the selected language to storage
  languageDropdown.addEventListener('change', () => {
    const selectedLanguage = languageDropdown.value;
    chrome.storage.sync.set({ selectedLanguage });
  });
});
