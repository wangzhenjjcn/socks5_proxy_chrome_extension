document.addEventListener("DOMContentLoaded", async () => {
  const enableProxy = document.getElementById("enableProxy");
  const serverAddress = document.getElementById("serverAddress");
  const serverPort = document.getElementById("serverPort");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const enableRuleProxy = document.getElementById("enableRuleProxy");

  chrome.storage.local.get(
    [
      "enableProxy",
      "serverAddress",
      "serverPort",
      "username",
      "password",
      "enableRuleProxy",
    ],
    (config) => {
      enableProxy.checked = config.enableProxy || false;
      serverAddress.value = config.serverAddress || "";
      serverPort.value = config.serverPort || "";
      username.value = config.username || "";
      password.value = config.password || "";
      enableRuleProxy.checked = config.enableRuleProxy || false;
    }
  );

  document.getElementById("proxyForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    chrome.storage.local.set({
      enableProxy: enableProxy.checked,
      serverAddress: serverAddress.value.trim(),
      serverPort: parseInt(serverPort.value),
      username: username.value.trim(),
      password: password.value.trim(),
      enableRuleProxy: enableRuleProxy.checked,
    });

    chrome.runtime.sendMessage({ action: "updateProxyConfig" });
  });
});
