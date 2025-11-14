Hooks.once("ready", async () => {

  if (!game.user.isGM) return;

  const macroName = "Toggle Chargen GM Only";

  // Se la macro già esiste, non ricrearla
  let macro = game.macros.getName(macroName);
  if (macro) return;

  const command = `
const MODULE = "wfrp4e-chargen-gm-only";
const KEY = "enabled";

(async () => {
  if (!game.settings.settings.has(\`\${MODULE}.\${KEY}\`)) {
    ui.notifications.error("Il modulo non è caricato correttamente.");
    return;
  }

  const current = game.settings.get(MODULE, KEY);
  const next = !current;

  await game.settings.set(MODULE, KEY, next);

  ui.notifications.info(\`Filtro CHARGEN (GM Only) \${next ? "ATTIVATO" : "DISATTIVATO"}.\`);
})();
  `.trim();

  // Crea la macro
  macro = await Macro.create({
    name: macroName,
    type: "script",
    img: "icons/svg/lock.svg",
    command
  });

  // Aggiungila alla hotbar del GM (prima slot libero)
  let hotbarSlot = ui.hotbar.getFreeSlot();
  ui.hotbar.assignHotbarMacro(macro, hotbarSlot);

  ui.notifications.info("Macro 'Toggle Chargen GM Only' creata automaticamente.");
});
