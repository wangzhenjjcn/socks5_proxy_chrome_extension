chrome.storage.local.get(['proxyEnabled', 'enableAutoProxy', 'proxyRules'], (items) => {
    if (items.proxyEnabled && items.enableAutoProxy) {
      const url = new URL(window.location.href);
      const domain = url.hostname;
      const matchedRule = items.proxyRules.find((rule) => domain.endsWith(rule));
  
      if (matchedRule) {
        chrome.runtime.sendMessage({ proxyEnabled: true });
      } else {
        chrome.runtime.sendMessage({ proxyEnabled: false });
      }
    }
  });
  