// scripts/block-player-ui-warnings.js
// Previene i warning dei player quando Hide Player UI tenta di aggiornare
// la setting "hide-player-ui.settings" (che è world-level e solo il GM può modificare).

Hooks.once("ready", () => {

  // Questo fix va applicato solo ai player
  if (game.user.isGM) return;

  Hooks.on("preUpdateSetting", (setting, changes, options, userId) => {

    // Blocca gli update alla setting globale del modulo Hide Player UI
    if (setting.key === "hide-player-ui.settings") {
      console.log(
        "Block: Player prevented from updating hide-player-ui.settings",
        { user: game.user.name, changes }
      );

      // Restituiamo false per bloccare l’update
      return false;
    }

  });

});
