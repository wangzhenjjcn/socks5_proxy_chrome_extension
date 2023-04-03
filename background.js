let serverAddress;
let serverPort;
let username;
let password;

const fetchGfwList = async () => {
  const response = await fetch(
    "https://bitbucket.org/gfwlist/gfwlist/raw/HEAD/gfwlist.txt"
  );
  const base64Data = await response.text();
  const decodedData = atob(base64Data);
  return decodedData.split("\n");
};

const updateProxyConfig = async () => {
  const {
    enableProxy,
    serverAddress: newServerAddress,
    serverPort: newServerPort,
    username: newUsername,
    password: newPassword,
    enableRuleProxy,
  } = await new Promise((resolve) => {
    chrome.storage.local.get(
      [
        "enableProxy",
        "serverAddress",
        "serverPort",
        "username",
        "password",
        "enableRuleProxy",
      ],
      resolve
    );
  });

  serverAddress = newServerAddress;
  serverPort = newServerPort;
  username = newUsername;
  password = newPassword;

  if (!enableProxy) {
    await chrome.proxy.settings.set({
      value: { mode: "direct" },
      scope: "regular",
    });
    return;
  }

  const config = {
    mode: "pac_script",
    pacScript: {
      data: `function FindProxyForURL(url, host) {
        if (${enableRuleProxy ? "dnsDomainIs(host, 'bitbucket.org')" : "false"}) {
          return 'SOCKS5 ${serverAddress}:${serverPort}';
        }
        return 'DIRECT';
      }`,
    },
  };

  await chrome.proxy.settings.set({ value: config, scope: "regular" });

  if (enableRuleProxy) {
    const gfwList = await fetchGfwList();
    await chrome.storage.local.set({ gfwList });
  }
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateProxyConfig") {
    updateProxyConfig();
  }
});

chrome.runtime.onInstalled.addListener(() => {
  updateProxyConfig();
});

const checkDomainInGfwList = (domain, gfwList) => {
  const matchPattern = (pattern, domain) => {
    // 根据gfwList的规则进行匹配
    // 实现匹配规则
  };

  for (const pattern of gfwList) {
    if (matchPattern(pattern, domain)) {
      return true;
    }
  }
  return false;
};

const handleProxyRequest = async (details) => {
  const { enableProxy, enableRuleProxy, gfwList } = await new Promise((resolve) => {
    chrome.storage.local.get(["enableProxy", "enableRuleProxy", "gfwList"], resolve);
  });

  if (!enableProxy) {
    return { cancel: false };
  }

  const url = new URL(details.url);
  const domain = url.hostname;


  if (enableRuleProxy && checkDomainInGfwList(domain, gfwList)) {
    return { type: "socks", host: serverAddress, port: serverPort };
  } else {
    return { type: "direct" };
  }
};

chrome.webRequest.onBeforeRequest.addListener(
  handleProxyRequest,
  { urls: ["<all_urls>"] },
  ["blocking"]
);
