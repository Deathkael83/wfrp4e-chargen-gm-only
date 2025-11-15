// scripts/remote-reload-listener.js
// Ogni client ascolta il comando "reload" dal GM e ricarica la pagina.

Hooks.once("ready", () => {
  // Sostituisci con l'ID reale del tuo modulo, identico a quello in module.json
  const MODULE_ID = "wfrp4e-chargen-gm-only";

  game.socket.on(`module.${MODULE_ID}`, data => {
    if (!data || data.action !== "reload") return;

    ui.notifications.info("Il GM ha aggiornato l'interfaccia. Ricarico la pagina...");

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });
});
