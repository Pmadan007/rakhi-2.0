document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("room");
  const role = urlParams.get("role") || "sister";

  console.log(`🚀 Starting Rakhi call: room=${roomId}, role=${role}`);

  if (!roomId || !role) {
    alert("Missing room or role in URL");
    return;
  }

  // ✅ Step 1: Get Token from Netlify Function
  const tokenUrl = `/.netlify/functions/getToken?roomId=${roomId}&role=${role}`;
  let token;
  try {
    const res = await fetch(tokenUrl);
    const data = await res.json();
    token = data.token;
    console.log("✅ Got token");
  } catch (err) {
    console.error("❌ Error fetching token", err);
    return;
  }

  // ✅ Step 2: Setup HMS
  const hmsStore = new window.HMSReactiveStore.HMSStore();
  const hmsActions = new window.HMSReactiveStore.HMSActions(hmsStore);

  await hmsActions.join({
    userName: role === "sister" ? "Sister 👧" : "Brother 🧑‍🦱",
    authToken: token,
    settings: {
      isAudioMuted: false,
      isVideoMuted: false,
    },
  });

  // ✅ Step 3: Subscribe to peers and render
  const renderVideo = () => {
    const peers = hmsStore.getState((state) => state.peers);
    const localVideo = document.getElementById("local-video");
    const remoteVideo = document.getElementById("remote-video");

    localVideo.innerHTML = "";
    remoteVideo.innerHTML = "";

    peers.forEach((peer) => {
      const videoEl = document.createElement("video");
      videoEl.autoplay = true;
      videoEl.playsInline = true;
      videoEl.muted = peer.isLocal;

      hmsActions.attachVideo(peer.id, videoEl);

      const wrapper = document.createElement("div");
      wrapper.className = "peer-wrapper";

      const nameTag = document.createElement("div");
      nameTag.className = "peer-name";
      nameTag.innerText = peer.name;

      wrapper.appendChild(videoEl);
      wrapper.appendChild(nameTag);

      if (peer.isLocal) {
        localVideo.appendChild(wrapper);
      } else {
        remoteVideo.appendChild(wrapper);
      }
    });
  };

  hmsStore.subscribe(renderVideo, (state) => state.peers);
});
