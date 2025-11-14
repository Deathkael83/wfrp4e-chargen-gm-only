Hooks.once("ready", () => {

  // Usiamo questo modulo solo con WFRP4e
  if (game.system.id !== "wfrp4e") return;

  const MODULE = "wfrp4e-chargen-gm-only";
  const KEY = "enabled";

  // Setting per accendere/spegnere il filtro
  if (!game.settings.settings.has(`${MODULE}.${KEY}`)) {
    game.settings.register(MODULE, KEY, {
      name: "Filtro CHARGEN (GM Only)",
      hint: "Se attivo, tutti i messaggi dei giocatori in chat diventano visibili solo ai GM (utile durante la generazione PG).",
      scope: "world",
      config: true,
      type: Boolean,
      default: false
    });
  }

  // Hook sulla creazione dei messaggi di chat
  Hooks.on("preCreateChatMessage", (doc, data, options, userId) => {

    const enabled = game.settings.get(MODULE, KEY);
    if (!enabled) return;

    // Se è già un whisper, non tocchiamo nulla
    if (data.whisper && data.whisper.length) return;

    // Utente che sta creando il messaggio
    const sender = game.users.get(userId);
    if (!sender) return;

    // I GM non vengono filtrati: vedono e scrivono normalmente
    if (sender.isGM) return;

    // Da qui in poi: è un messaggio creato da un player
    // → lo trasformiamo in whisper cieco ai soli GM
    const gmIds = game.users.filter(u => u.isGM).map(u => u.id);

    data.whisper = gmIds;
    data.blind = true;
  });
});
