// scripts/remote-reload-listener.js
// Ogni client ascolta il comando "reload" dal GM e ricarica la pagina.

Hooks.once("ready", () => {
  // ID del modulo: DEVE essere uguale a quello in module.json
  const MODULE_ID = "wfrp4e-chargen-gm-only";

  console.log(`[${MODULE_ID}] Reload listener inizializzato per`, game.user.name);

  game.socket.on(`module.${MODULE_ID}`, data => {
    console.log(`[${MODULE_ID}] Messaggio socket ricevuto su client`, game.user.name, data);

    if (!data || data.action !== "reload") return;

    ui.notifications.info("Il GM ha aggiornato l'interfaccia. Ricarico la pagina...");

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });
});
