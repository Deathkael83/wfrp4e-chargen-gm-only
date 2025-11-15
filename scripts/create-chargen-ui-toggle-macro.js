// scripts/create-chargen-ui-toggle-macro.js
// Crea automaticamente la macro "Chargen UI Hidden" per il GM

Hooks.once("ready", async () => {

  if (!game.user.isGM) return;

  const macroName = "Chargen UI Hidden";

  // Se la macro esiste già, non ricrearla
  let macro = game.macros.getName(macroName);
  if (macro) return;

  const command =
`// Macro: TOGGLE CHARGEN NASCOSTA (versione aggiornata)
// - hide-player-ui: hideForAllPlayers, chatLog, chatInput
// - nores-interface-enhancements: hideChatPeek

const HIDE_PLAYER_UI_MODULE = "hide-player-ui";
const HIDE_PLAYER_UI_SETTING_KEY = "hideForAllPlayers";

const NORE_MODULE = "nores-interface-enhancements";
const NORE_SETTING_KEY = "hideChatPeek";

// ID del modulo usato per il canale socket
const RELOAD_MODULE_ID = "wfrp4e-chargen-gm-only";

(async () => {
  // ===== LEGGI STATO CORRENTE =====
  const current = game.settings.get(HIDE_PLAYER_UI_MODULE, HIDE_PLAYER_UI_SETTING_KEY);
  const newValue = !current;

  // ===== TOGGLE hideForAllPlayers =====
  await game.settings.set(HIDE_PLAYER_UI_MODULE, HIDE_PLAYER_UI_SETTING_KEY, newValue);

  // ===== TOGGLE Nore's hideChatPeek =====
  try {
    await game.settings.set(NORE_MODULE, NORE_SETTING_KEY, newValue);
  } catch (e) {
    console.warn("Impossibile aggiornare setting di Nore's Interface Enhancements:", e);
  }

  // ===== TOGGLE chatLog e chatInput =====
  const CONFIG_SETTING = "settings";

  let cfg = game.settings.get(HIDE_PLAYER_UI_MODULE, CONFIG_SETTING);

  try {
    cfg = foundry.utils.duplicate(cfg);
  } catch (e) {
    cfg = JSON.parse(JSON.stringify(cfg));
  }

  if (cfg.hideSideBar) {
    if ("chatLog" in cfg.hideSideBar) {
      cfg.hideSideBar.chatLog = newValue;
    }
    if ("chatInput" in cfg.hideSideBar) {
      cfg.hideSideBar.chatInput = newValue;
    }

    await game.settings.set(HIDE_PLAYER_UI_MODULE, CONFIG_SETTING, cfg);
  } else {
    console.warn("hideSideBar non trovato in hide-player-ui.settings");
  }

  // ===== NOTIFICA + RELOAD CLIENT =====
  const stato = newValue ? "ATTIVATA" : "DISATTIVATA";
  game.socket.emit(\`module.\${RELOAD_MODULE_ID}\`, { action: "reload" });
  ui.notifications.info(\`Modalità CHARGEN nascosta: \${stato}. I client dei giocatori verranno ricaricati.\`);
})();`;

  // Crea la macro
  macro = await Macro.create({
    name: macroName,
    type: "script",
    img: "icons/svg/padlock.svg",
    command
  });

  // Mettila nel primo slot libero della hotbar del GM
  const slot = ui.hotbar.getFreeSlot();
  ui.hotbar.assignHotbarMacro(macro, slot);

  ui.notifications.info("Macro 'Chargen UI Hidden' creata automaticamente.");
});
