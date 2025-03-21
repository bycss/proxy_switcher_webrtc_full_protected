chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setIcon({ path: "icons/icon-gray.png" });
});

chrome.runtime.onStartup.addListener(async () => {
  const result = await chrome.storage.local.get('currentIndex');
  if (result.currentIndex !== undefined && result.currentIndex !== -1) {
    chrome.action.setIcon({ path: "icons/icon-green.png" });
  } else {
    chrome.action.setIcon({ path: "icons/icon-gray.png" });
  }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'setProxy') {
    const result = await chrome.storage.local.get('exceptions');
    const bypassList = result.exceptions || [];

    const config = {
      mode: 'fixed_servers',
      rules: {
        singleProxy: {
          scheme: message.type,
          host: message.host,
          port: parseInt(message.port)
        },
        bypassList: bypassList
      }
    };
    chrome.proxy.settings.set({ value: config, scope: 'regular' });
    chrome.action.setIcon({ path: 'icons/icon-green.png' });
  }

  if (message.action === 'setDirect') {
    chrome.proxy.settings.set({ value: { mode: 'direct' }, scope: 'regular' });
    chrome.action.setIcon({ path: 'icons/icon-gray.png' });
  }

  if (message.action === 'setWebRTC') {
    chrome.privacy.network.webRTCIPHandlingPolicy.set({
      value: message.enabled ? 'disable_non_proxied_udp' : 'default'
    });

    chrome.storage.local.set({ webrtcEnabled: message.enabled });

    if (chrome.scripting?.registerContentScripts) {
      if (message.enabled) {
        chrome.scripting.registerContentScripts([{
          id: "blockRTC",
          matches: ["<all_urls>"],
          js: ["block_webrtc.js"],
          runAt: "document_start",
          allFrames: true
        }]);
      } else {
        try {
          chrome.scripting.unregisterContentScripts(["blockRTC"]);
        } catch (e) {}
      }
    }
  }
});