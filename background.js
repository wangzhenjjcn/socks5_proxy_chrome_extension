async function updateRuleList() {
  const response = await fetch('https://bitbucket.org/gfwlist/gfwlist/raw/HEAD/gfwlist.txt');
  const ruleListText = await response.text();
  const ruleList = ruleListText.split('\n').filter(line => line.trim() !== '');

  chrome.storage.local.set({ruleList}, () => {
    console.log('规则列表已更新');
  });

  // 每天更新一次规则列表
  setTimeout(updateRuleList, 24 * 60 * 60 * 1000);
}

// 启动时更新规则列表
updateRuleList();


function applyProxySettings() {
  chrome.storage.local.get(['proxyStatus', 'server', 'port', 'username', 'password'], result => {
    const {proxyStatus, server, port, username, password} = result;

    if (proxyStatus === 'on') {
      const config = {
        mode: 'pac_script',
        pacScript: {
          data: `function FindProxyForURL(url, host) {
            const ruleList = ${JSON.stringify(result.ruleList)};
            if (ruleList.some(rule => host.endsWith(rule))) {
              return 'SOCKS5 ${server}:${port}${username && password ? `; PROXY ${server}:${port}` : ''}';
            }
            return 'DIRECT';
          }`
        }
      };

      chrome.proxy.settings.set({value: config, scope: 'regular'}, () => {
        console.log('代理设置已应用');
      });
    } else {
      chrome.proxy.settings.set({value: {mode: 'direct'}, scope: 'regular'}, () => {
        console.log('代理已关闭');
      });
    }
  });
}

// 在启动时和代理状态变更时应用代理设置
chrome.runtime.onStartup.addListener(applyProxySettings);
chrome.storage.onChanged.addListener(changes => {
  if ('proxyStatus' in changes) {
    applyProxySettings();
  }
});

function updateRuleList() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'updateRuleList' }, response => {
      if (response && response.success) {
        console.log('规则列表已更新');
      }
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  updateRuleList();
});
