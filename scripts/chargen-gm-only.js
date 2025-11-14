// Evita warning dei player su hide-player-ui.settings
if (!game.user.isGM) {
  Hooks.on("preUpdateSetting", (setting, changes, options, userId) => {
    if (setting.key === "hide-player-ui.settings") {
      console.log("Block: Player prevented from updating hide-player-ui.settings");
      return false; // blocca l'update e previene il warning
    }
  });
}
