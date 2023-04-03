function updateRuleList() {
    fetch('https://bitbucket.org/gfwlist/gfwlist/raw/HEAD/gfwlist.txt')
      .then(response => response.text())
      .then(ruleListText => {
        const ruleList = ruleListText.split('\n').filter(line => line.trim() !== '');
        chrome.storage.local.set({ ruleList }, () => {
          console.log('规则列表已更新');
        });
      });
  }
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateRuleList') {
      updateRuleList();
      sendResponse({ success: true });
    }
  });
  