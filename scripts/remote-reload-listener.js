// scripts/remote-reload-listener.js
// Ogni client ascolta il comando "reload" dal GM e ricarica la pagina.

Hooks.once("ready", () => {
  game.socket.on("module.wfrp4e-chargen-gm-only", data => {

    if (!data || data.action !== "reload") return;

    ui.notifications.info("Il GM ha aggiornato l'interfaccia. Ricarico la pagina...");

    setTimeout(() => {
      window.location.reload();
    }, 1000);

  });
});
