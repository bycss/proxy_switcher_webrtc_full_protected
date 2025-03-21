const configList = document.getElementById('configList');
const configName = document.getElementById('configName');
const proxyType = document.getElementById('proxyType');
const proxyHost = document.getElementById('proxyHost');
const proxyPort = document.getElementById('proxyPort');
const exceptionDomain = document.getElementById('exceptionDomain');
const exceptionList = document.getElementById('exceptionList');
const statusText = document.getElementById('status');
const savedConfigs = document.getElementById('savedConfigs');
const webrtcToggle = document.getElementById('webrtcToggle');

async function updateStatusLabel(mode, config) {
  if (mode === 'direct') {
    statusText.textContent = '当前状态：未使用代理';
    statusText.style.color = 'gray';
    configList.value = 'none';
  } else if (mode === 'proxy' && config !== undefined) {
    statusText.textContent = `当前状态：使用代理 ${config.name}`;
    statusText.style.color = 'green';
    configList.value = config.index.toString();
  }
}

async function loadConfigs() {
  const result = await chrome.storage.local.get(['configs', 'exceptions', 'currentIndex']);
  const configs = result.configs || [];
  const exceptions = result.exceptions || [];
  const currentIndex = result.currentIndex;

  configList.innerHTML = '';
  const noneOption = document.createElement('option');
  noneOption.value = 'none';
  noneOption.textContent = '不使用代理';
  configList.appendChild(noneOption);

  savedConfigs.innerHTML = '';
  configs.forEach((cfg, index) => {
    const opt = document.createElement('option');
    opt.value = index;
    opt.textContent = `${cfg.name} (${cfg.type})`;
    configList.appendChild(opt);

    const wrapper = document.createElement('div');
    wrapper.className = 'proxy-item';

    const span = document.createElement('span');
    span.textContent = `${cfg.name} - ${cfg.host}:${cfg.port}`;
    wrapper.appendChild(span);

    const delBtn = document.createElement('button');
    delBtn.textContent = '删除';
    delBtn.onclick = async () => {
      configs.splice(index, 1);
      await chrome.storage.local.set({ configs });
      if (currentIndex === index) {
        await chrome.runtime.sendMessage({ action: 'setDirect' });
        await chrome.storage.local.set({ currentIndex: -1 });
      }
      loadConfigs();
    };
    wrapper.appendChild(delBtn);
    savedConfigs.appendChild(wrapper);
  });

  exceptionList.innerHTML = '';
  exceptions.forEach((domain, index) => {
    const li = document.createElement('li');
    li.textContent = domain;
    li.style.cursor = 'pointer';
    li.onclick = async () => {
      exceptions.splice(index, 1);
      await chrome.storage.local.set({ exceptions });
      loadConfigs();
    };
    exceptionList.appendChild(li);
  });

  // 快速切换按钮
  const quickButtons = document.getElementById('quickButtons');
  quickButtons.innerHTML = '';
  configs.forEach((cfg, index) => {
    const btn = document.createElement('button');
    btn.textContent = cfg.name;
    btn.onclick = async () => {
      await chrome.runtime.sendMessage({
        action: 'setProxy',
        type: cfg.type,
        host: cfg.host,
        port: cfg.port
      });
      await chrome.storage.local.set({ currentIndex: index });
      updateStatusLabel('proxy', { ...cfg, index });
    };
    quickButtons.appendChild(btn);
  });

  const offBtn = document.createElement('button');
  offBtn.textContent = '关闭代理';
  offBtn.onclick = async () => {
    await chrome.runtime.sendMessage({ action: 'setDirect' });
    await chrome.storage.local.set({ currentIndex: -1 });
    updateStatusLabel('direct');
  };
  quickButtons.appendChild(offBtn);

  if (currentIndex === -1 || currentIndex === undefined) {
    updateStatusLabel('direct');
  } else if (configs[currentIndex]) {
    updateStatusLabel('proxy', { ...configs[currentIndex], index: currentIndex });
  }
}

document.getElementById('saveConfig').addEventListener('click', async () => {
  const name = configName.value.trim();
  const type = proxyType.value;
  const host = proxyHost.value.trim();
  const port = proxyPort.value.trim();

  if (!name || !host || !port) {
    alert('请填写完整的配置');
    return;
  }

  const result = await chrome.storage.local.get('configs');
  const configs = result.configs || [];

  configs.push({ name, type, host, port });
  await chrome.storage.local.set({ configs });
  await loadConfigs();
  alert('保存成功');
});

document.getElementById('apply').addEventListener('click', async () => {
  const selected = configList.value;

  if (selected === 'none') {
    await chrome.runtime.sendMessage({ action: 'setDirect' });
    await chrome.storage.local.set({ currentIndex: -1 });
    updateStatusLabel('direct');
  } else {
    const result = await chrome.storage.local.get('configs');
    const configs = result.configs || [];
    const cfg = configs[selected];

    if (cfg) {
      await chrome.runtime.sendMessage({
        action: 'setProxy',
        type: cfg.type,
        host: cfg.host,
        port: cfg.port
      });
      await chrome.storage.local.set({ currentIndex: parseInt(selected) });
      updateStatusLabel('proxy', { ...cfg, index: selected });
    }
  }
});

document.getElementById('addException').addEventListener('click', async () => {
  const domain = exceptionDomain.value.trim();
  if (!domain) return;

  const result = await chrome.storage.local.get('exceptions');
  const exceptions = result.exceptions || [];

  if (!exceptions.includes(domain)) {
    exceptions.push(domain);
    await chrome.storage.local.set({ exceptions });
  }

  exceptionDomain.value = "";
  loadConfigs();
});

// 初始化 WebRTC 设置
chrome.storage.local.get('webrtcEnabled', (data) => {
  webrtcToggle.checked = !!data.webrtcEnabled;
});

webrtcToggle.addEventListener('change', async () => {
  const enabled = webrtcToggle.checked;
  await chrome.runtime.sendMessage({ action: 'setWebRTC', enabled });
  await chrome.storage.local.set({ webrtcEnabled: enabled });
});

loadConfigs();