document.getElementById('toggleProxy').addEventListener('click', toggleProxy);

function toggleProxy() {
  chrome.storage.local.get(['proxyEnabled'], (items) => {
    const proxyEnabled = !items.proxyEnabled;
    chrome.storage.local.set({ proxyEnabled }, () => {
      updateProxyStatus(proxyEnabled);
    });
  });
}

function updateProxyStatus(proxyEnabled) {
  chrome.runtime.sendMessage({ proxyEnabled });
  document.getElementById('toggleProxy').innerText = proxyEnabled ? '关闭代理' : '开启代理';
}

chrome.storage.local.get(['proxyEnabled'], (items) => {
  updateProxyStatus(items.proxyEnabled);
});
