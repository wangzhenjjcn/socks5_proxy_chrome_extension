importScripts('icon_utils.js');



chrome.runtime.onMessage.addListener((message) => {
    if (message.hasOwnProperty('proxyEnabled')) {
      updateProxyStatus(message.proxyEnabled);
    }
  });
  
  function updateProxyStatus(proxyEnabled) {
    chrome.storage.local.get(
      ['server', 'port', 'username', 'password', 'enableAutoProxy'],
      (items) => {
        const config = {
          mode: 'fixed_servers',
          rules: {
            singleProxy: {
              scheme: 'socks5',
              host: items.server,
              port: parseInt(items.port, 10)
            },
            bypassList: []
          }
        };
  
        if (items.username && items.password) {
          config.rules['proxyAuthorizationHeader'] = `Basic ${btoa(items.username + ':' + items.password)}`;
        }
  
        if (!proxyEnabled) {
          config.mode = 'direct';
        }
  
        chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => {
          if (proxyEnabled && items.enableAutoProxy) {
            updateProxyRules();
          }
        });
      }
    );
    updateIconColor(proxyEnabled);
  }
  
  function updateProxyRules() {
    fetch('https://bitbucket.org/gfwlist/gfwlist/raw/HEAD/gfwlist.txt')
      .then((response) => response.text())
      .then((text) => {
        const rules = text.split('\n').filter((rule) => rule.length > 0 && !rule.startsWith('!'));
        chrome.storage.local.set({ proxyRules: rules });
        setAutoProxyRules(rules);
      });
  }
  
  function setAutoProxyRules(rules) {
    chrome.proxy.settings.get({}, (config) => {
      config.value.rules.bypassList = rules;
      chrome.proxy.settings.set({ value: config.value, scope: 'regular' });
    });
  }
  
  chrome.storage.local.get(['enableAutoProxy'], (items) => {
    if (items.enableAutoProxy) {
      updateProxyRules();
      setInterval(updateProxyRules, 24 * 60 * 60 * 1000); // 每天更新一次规则
    }
  });
  
  chrome.storage.local.get(['proxyEnabled'], (items) => {
    updateProxyStatus(items.proxyEnabled);
  });
  
  function updateIconColor(proxyEnabled) {
    const color = proxyEnabled ? '#4CAF50' : '#9E9E9E';
    chrome.action.setIcon({
      imageData: generateIconImageData(color)
    });
  }
  
  function generateIconImageData(color) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    canvas.width = 19;
    canvas.height = 19;
  
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(9, 9, 9, 0, 2 * Math.PI);
    ctx.fill();
  
    return ctx.getImageData(0, 0, 19, 19);
  }
  
 