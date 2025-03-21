chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'setWebRTC') {
    chrome.privacy.network.webRTCIPHandlingPolicy.set({
      value: message.enabled ? 'disable_non_proxied_udp' : 'default'
    });
    return;
  }

  if (message.action === 'setProxy') {
    const exceptions = (await chrome.storage.local.get('exceptions')).exceptions || [];

    chrome.proxy.settings.set({
      value: {
        mode: 'fixed_servers',
        rules: {
          singleProxy: {
            scheme: message.type,
            host: message.host,
            port: parseInt(message.port)
          },
          bypassList: exceptions
        }
      },
      scope: 'regular'
    });

    chrome.action.setIcon({ path: {
      "16": "icons/icon-green.png"
    } });
  } else if (message.action === 'setDirect') {
    chrome.proxy.settings.set({
      value: { mode: 'direct' },
      scope: 'regular'
    });

    chrome.action.setIcon({ path: {
      "16": "icons/icon-gray.png"
    } });
  }
});