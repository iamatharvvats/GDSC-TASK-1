chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const url = activeTab.url;

      // Validate the URL before creating a URL object
      if (isValidUrl(url)) {
        const domain = new URL(url).hostname;

        // Check if the tab has a group ID before trying to update the group
        if (activeTab.groupId !== undefined && activeTab.groupId !== -1) {
          // If the tab is already in a group, update the group title
          chrome.tabGroups.update(activeTab.groupId, { title: domain }, function(updatedGroup) {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            }
          });
        } else {
          // If the tab is not in a group, create a new group and update the group title
          chrome.tabs.group({ tabIds: tabId }, function(group) {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            } else {
              chrome.tabGroups.update(group, { title: domain }, function(updatedGroup) {
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError);
                }
              });
            }
          });
        }
      } else {
        console.error('Invalid URL:', url);
        // Handle the invalid URL as needed
      }
    });
  }
});

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
