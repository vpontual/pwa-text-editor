const butInstall = document.getElementById("buttonInstall");

// Logic for installing the PWA

// Hide the install button if the PWA is already installed
window.addEventListener("beforeinstallprompt", (event) => {
  window.deferredPrompt = event;
  butInstall.classList.toggle("hidden", false);
});

// When the install button is clicked, the prompt event is triggered
butInstall.addEventListener("click", async () => {
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    return;
  }
  promptEvent.prompt();
  window.deferredPrompt = null;
  butInstall.classList.toggle("hidden", true);
});

// The appinstalled event is triggered when the PWA is installed
window.addEventListener("appinstalled", (event) => {
  window.deferredPrompt = null;
});
