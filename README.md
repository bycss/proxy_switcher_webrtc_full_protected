# Proxy Switcher - Chrome Extension 🔀🧩

## 🧭 简介（中文）

**Proxy Switcher** 是一个简洁强大的 Chrome 浏览器代理切换插件，支持：

- 一键切换多个代理配置（支持 SOCKS5 / HTTP）
- 全局启用 / 禁用代理
- 支持代理例外列表（支持通配符，如 `*.example.com`）
- 可视化状态（启用时图标变绿）
- 支持 WebRTC 防 IP 泄漏
- 快速切换按钮（无需下拉菜单）
- 自动保存上次使用配置

适合需要频繁切换代理环境、批量测试或日常翻墙使用。

---

## 🌍 Introduction (English)

**Proxy Switcher** is a lightweight yet powerful Chrome extension that allows:

- One-click switching between multiple proxy configurations (SOCKS5/HTTP)
- Global proxy toggle (enable/disable)
- Exception list support with wildcard domains (e.g., `*.example.com`)
- Visual indicator: green icon when proxy is active
- WebRTC leak prevention toggle
- Quick switch buttons (no dropdown needed)
- Remembers last-used proxy across sessions

Perfect for developers, researchers, or anyone needing to manage proxies efficiently.

---



## 📦 安装方法 Installation

1. 下载或克隆本项目：
   ```bash
   git clone https://github.com/yourname/proxy-switcher.git



打开 Chrome，进入地址栏：

arduino
复制
编辑
chrome://extensions/
打开右上角的「开发者模式」

点击「加载已解压的扩展程序」，选择 proxy-switcher 文件夹

🖼️ 截图 Screenshots


🔧 使用说明 Usage
在弹出面板中：
填写代理名称、类型、地址与端口，点击保存
使用快速按钮或下拉菜单选择代理并应用
可添加例外域名（如 *.google.com 不走代理）
开启 WebRTC 防泄漏保护（推荐）
🛡️ 隐私与安全
本插件 完全离线运行，不会收集任何用户信息或网络数据，所有代理配置保存在浏览器本地 localStorage 中。

📄 License
MIT License. 自由使用，欢迎改进与提 PR！

欢迎 Star ⭐、Fork 🍴、提建议 🙌！
