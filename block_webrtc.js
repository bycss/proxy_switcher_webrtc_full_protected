// 强力禁用 WebRTC（兼容 Chromium/Vivaldi）
Object.defineProperty(window, 'RTCPeerConnection', {
  value: undefined,
  writable: false
});
Object.defineProperty(window, 'webkitRTCPeerConnection', {
  value: undefined,
  writable: false
});