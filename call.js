// Get room ID from URL
const roomId = new URLSearchParams(window.location.search).get("roomId");

// Fetch token from backend
async function getToken(roomId) {
  const res = await fetch(`/api/getToken?roomId=${roomId}`);
  const data = await res.json();
  return data.token;
}

// Initialize 100ms
(async () => {
  const token = await getToken(roomId);

  const store = new HMS.HMSReactiveStore(); // ✅ Notice the HMS namespace
  const hmsActions = store.getHMSActions();
  const hmsStore = store.getStore();

  await hmsActions.join({
    userName: "Sibling",
    authToken: token,
    settings: {
      isAudioMuted: false,
      isVideoMuted: false,
    },
  });

  // Subscribe to peer updates
  hmsStore.subscribe(peers => {
    const container = document.getElementById("video-container");
    container.innerHTML = "";
    peers.forEach(peer => {
      if (peer.videoTrack) {
        const video = document.createElement("video");
        video.autoplay = true;
        video.playsInline = true;
        video.muted = peer.isLocal;
        hmsActions.attachVideo(peer.videoTrack, video);
        container.appendChild(video);
      }
    });
  }, store.getSelector().getPeers);
})();
