document.getElementById('proxyForm').addEventListener('submit', event => {
    event.preventDefault();
  
    const server = document.getElementById('server').value;
    const port = document.getElementById('port').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    chrome.storage.local.set({
      server,
      port,
      username,
      password
    }, () => {
      alert('设置已保存');
    });
  });
  