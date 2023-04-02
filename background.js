async function setProxy(enabled) {
    if (enabled) {
      chrome.proxy.settings.set({
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
      });
    } else {
      chrome.proxy.settings.set({ value: { mode: 'direct' }, scope: 'regular' });
    }
  }
  
  (async () => {
    const proxyEnabled = await getProxyEnabled();
    await setProxy(proxyEnabled);
  })();
  
  async function getProxyEnabled() {
    const result = await new Promise((resolve) => {
      chrome.storage.local.get(['proxyEnabled'], (result) => {
        resolve(result.proxyEnabled || false);
      });
    });
    return result;
  }
  