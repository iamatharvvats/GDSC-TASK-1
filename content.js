chrome.runtime.sendMessage({ action: 'getTabColor', url: window.location.hostname }, function (response) {
    if (response && response.color) {
      const style = document.createElement('style');
      style.textContent = `
        .tab-color-marker {
          background-color: ${response.color} !important;
        }
      `;
      document.head.appendChild(style);
      document.body.classList.add('tab-color-marker');
    }
  });
  