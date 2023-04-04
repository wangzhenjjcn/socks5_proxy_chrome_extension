document.getElementById('save').addEventListener('click', saveOptions);

function saveOptions() {
  const server = document.getElementById('server').value;
  const port = document.getElementById('port').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const enableAutoProxy = document.getElementById('enableAutoProxy').checked;

  chrome.storage.local.set(
    {
      server,
      port,
      username,
      password,
      enableAutoProxy
    },
    () => {
      alert('设置已保存');
    }
  );
}

function restoreOptions() {
  chrome.storage.local.get(
    ['server', 'port', 'username', 'password', 'enableAutoProxy'],
    (items) => {
      document.getElementById('server').value = items.server || '';
      document.getElementById('port').value = items.port || '';
      document.getElementById('username').value = items.username || '';
      document.getElementById('password').value = items.password || '';
      document.getElementById('enableAutoProxy').checked = items.enableAutoProxy || false;
    }
  );
}

document.addEventListener('DOMContentLoaded', restoreOptions);
