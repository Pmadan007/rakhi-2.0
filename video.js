
  const { token } = await res.json();

  const hms = new HMS.SDK();

  await hms.join({
    userName: userName,
    authToken: token,
    settings: {
      isAudioMuted: false,
      isVideoMuted: false,
    }
  });

  joinScreen.style.display = "none";
  videoContainer.style.display = "flex";

  hms.on(HMS.SDKEvents.PEER_JOINED, (peer) => {
    console.log("Peer joined:", peer.name);
  });

  hms.on(HMS.SDKEvents.TRACK_ADDED, (track, peer) => {
    if (track.kind === "video") {
      const video = document.createElement("video");
      video.autoplay = true;
      video.playsInline = true;
      hms.attachTrack(track, video);
      videoContainer.appendChild(video);
    }
  });
});
