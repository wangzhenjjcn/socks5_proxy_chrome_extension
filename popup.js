document.getElementById('toggleProxy').addEventListener('click', async () => {
  const currentStatus = await new Promise(resolve => {
    chrome.storage.local.get('proxyStatus', result => {
      resolve(result.proxyStatus || 'off');
    });
  });

  const newStatus = currentStatus === 'on' ? 'off' : 'on';
  chrome.storage.local.set({proxyStatus: newStatus}, () => {
    document.getElementById('toggleProxy').textContent = newStatus === 'on' ? '关闭代理' : '开启代理';
  });

  // 更新图标
  const iconPath = newStatus === 'on' ? 'icon128.png' : 'icon128_gray.png';
  chrome.action.setIcon({path: {'128': iconPath}});
});
