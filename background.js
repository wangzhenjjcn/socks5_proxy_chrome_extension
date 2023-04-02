const proxyServer = {
    host: 'aaaaaaa.com',
    port: 12345,
  };
  
  chrome.runtime.onMessage.addListener(async (message) => {
    if (typeof message.proxyEnabled !== 'undefined') {
      await setProxy(message.proxyEnabled);
    }
  });
  
  function updateIcon(enabled) {
    const iconPath = enabled ? 'icons/icon_color.png' : 'icons/icon_gray.png';
    chrome.action.setIcon({ path: iconPath });
  }
  

  async function setProxy(enabled) {
    if (enabled) {
      chrome.proxy.settings.set(
        {
          value: {
            mode: 'fixed_servers',
            rules: {
              singleProxy: {
                scheme: 'socks5',
                host: proxyServer.host,
                port: proxyServer.port,
              },
              bypassList: [],
            },
          },
          scope: 'regular',
        },
        () => {
          updateIcon(enabled);
        }
      );
    } else {
      chrome.proxy.settings.set(
        { value: { mode: 'direct' }, scope: 'regular' },
        () => {
          updateIcon(enabled);
        }
      );
    }
  }
  
  (async () => {
    const proxyEnabled = await getProxyEnabled();
    await setProxy(proxyEnabled);
    updateIcon(proxyEnabled);
  })();
  
  
  async function getProxyEnabled() {
    const result = await new Promise((resolve) => {
      chrome.storage.local.get(['proxyEnabled'], (result) => {
        resolve(result.proxyEnabled || false);
      });
    });
    return result;
  }
  


