// scripts/block-player-ui-warnings.js
// Blocca i tentativi dei player di aggiornare la Setting del modulo
// Hide Player UI che causa i warning di permessi.

// ID del documento Setting che genera il warning.
// Se in futuro dovesse cambiare, aggiorna questo valore.
const TARGET_SETTING_ID = "4m5whhgVZYcIp3zg";

Hooks.once("ready", () => {

  // Questo fix serve solo lato player
  if (game.user.isGM) return;

  Hooks.on("preUpdateSetting", (setting, changes, options, userId) => {

    // 1) Blocca in base all'ID (il modo più sicuro)
    if (setting.id === TARGET_SETTING_ID) {
      console.log("Blocca update Setting per player (ID match):", {
        user: game.user.name,
        id: setting.id,
        key: setting.key,
        changes
      });
      return false;
    }

    // 2) Ulteriore sicurezza: blocca qualunque world setting di "hide-player-ui"
    const key = setting.key || "";
    if (key.startsWith("hide-player-ui.")) {
      console.log("Blocca update Setting per player (namespace match):", {
        user: game.user.name,
        id: setting.id,
        key: setting.key,
        changes
      });
      return false;
    }

  });

});
