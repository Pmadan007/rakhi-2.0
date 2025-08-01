function log(msg) {
  const debugEl = document.getElementById("debug");
  if (debugEl) debugEl.textContent += `\n${msg}`;
}

document.addEventListener("DOMContentLoaded", () => {
  log("DOM loaded");

  const inviteBtn = document.getElementById("invite-btn");
  const inviteSection = document.getElementById("invite-section");
  const inviteLink = document.getElementById("invite-link");
  const copyBtn = document.getElementById("copy-btn");
  const startBtn = document.getElementById("start-btn");

  let roomId = "";

  inviteBtn?.addEventListener("click", async () => {
    log("Invite button clicked");
    const room_name = "rakhi_" + Math.random().toString(36).substring(2, 10);

    try {
      const res = await fetch("/.netlify/functions/createRoom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ room_name }),
      });

      const data = await res.json();
      log("Room created response: " + JSON.stringify(data));

      if (!data.id) {
        log("❌ No room ID returned.");
        return;
      }

      roomId = data.id;

      const fullLink = `${window.location.origin}/call.html?room=${roomId}`;
      inviteLink.value = fullLink;

      inviteBtn.style.display = "none";
      inviteSection.classList.remove("hidden");
      startBtn.classList.remove("hidden");
    } catch (err) {
      log("❌ Error: " + err.message);
    }
  });

  copyBtn?.addEventListener("click", () => {
    inviteLink.select();
    document.execCommand("copy");
    copyBtn.innerText = "Copied!";
    setTimeout(() => (copyBtn.innerText = "Copy"), 1500);
  });

  startBtn?.addEventListener("click", () => {
    if (roomId) {
      window.location.href = `call.html?room=${roomId}`;
    } else {
      log("❌ No roomId found!");
    }
  });
});
