const proxyEnabledKey = 'proxyEnabled';

document.getElementById('toggleProxy').addEventListener('click', async () => {
  const proxyEnabled = await getProxyEnabled();
  setProxyEnabled(!proxyEnabled);
  updateButton(!proxyEnabled);
});

async function getProxyEnabled() {
  const result = await new Promise((resolve) => {
    chrome.storage.local.get([proxyEnabledKey], (result) => {
      resolve(result[proxyEnabledKey] || false);
    });
  });
  return result;
}

function setProxyEnabled(enabled) {
  chrome.storage.local.set({ [proxyEnabledKey]: enabled }, () => {
    chrome.runtime.sendMessage({ proxyEnabled: enabled });
  });
}

function updateButton(enabled) {
  const button = document.getElementById('toggleProxy');
  button.innerText = enabled ? '禁用代理' : '开启代理';
}

(async () => {
  const proxyEnabled = await getProxyEnabled();
  updateButton(proxyEnabled);
})();
