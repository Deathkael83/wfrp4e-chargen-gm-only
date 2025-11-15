// scripts/remote-reload-listener.js
// Ogni client NON-GM si ricarica quando il GM cambia la configurazione di Hide Player UI.

Hooks.once("ready", () => {

  // Questo comportamento serve solo sui player
  if (game.user.isGM) return;

  console.log("[wfrp4e-chargen-gm-only] Listener updateSetting inizializzato per", game.user.name);

  Hooks.on("updateSetting", (setting, changes, options, userId) => {

    const key = setting.key || "";

    // Debug facoltativo:
    // console.log("[wfrp4e-chargen-gm-only] updateSetting su", game.user.name, key, setting, changes);

    // Caso 1: oggetto completo delle impostazioni di Hide Player UI
    if (key === "hide-player-ui.settings") {
      ui.notifications.info("Il GM ha aggiornato la UI dei giocatori. Ricarico la pagina...");
      setTimeout(() => window.location.reload(), 2000);
      return;
    }

    // Caso 2: per sicurezza, anche il toggle diretto su hideForAllPlayers
    if (key === "hide-player-ui.hideForAllPlayers") {
      ui.notifications.info("Il GM ha aggiornato la UI dei giocatori. Ricarico la pagina...");
      setTimeout(() => window.location.reload(), 2000);
      return;
    }

  });

});
