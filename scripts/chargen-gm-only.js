Hooks.once("ready", () => {

  // Funziona solo con WFRP4e
  if (game.system.id !== "wfrp4e") return;

  const MODULE = "wfrp4e-chargen-gm-only";
  const KEY = "enabled";

  // Setting per accendere/spegnere il filtro
  if (!game.settings.settings.has(`${MODULE}.${KEY}`)) {
    game.settings.register(MODULE, KEY, {
      name: "Filtro CHARGEN (GM Only)",
      hint: "Se attivo, i messaggi della generazione PG non vengono mostrati ai giocatori.",
      scope: "world",
      config: true,
      type: Boolean,
      default: false
    });
  }

  // Hook sul RENDER della chat: gira su OGNI client
  Hooks.on("renderChatMessage", (message, html, data) => {

    // Se il filtro è spento, non toccare nulla
    const enabled = game.settings.get(MODULE, KEY);
    if (!enabled) return;

    // Il GM vede sempre tutto
    if (game.user.isGM) return;

    // Contenuto HTML del messaggio
    const content = (message.content || "").toLowerCase();

    // Pattern dei messaggi di generazione PG (quelli che hai riportato tu)
    const chargenPatterns = [
      "ha iniziato la generazione del personaggio",     // CHARGEN.Message.Start
      "tirato:",                                        // CHARGEN.Message.Rolled
      "scegli:",                                        // CHARGEN.Message.Chosen
      "caratteristiche tirate",                         // CHARGEN.Message.RolledCharacteristics
      "caratteristiche ritirate",                       // CHARGEN.Message.ReRolledCharacteristics
      "scambiata",                                      // CHARGEN.Message.SwappedCharacteristics
      "iniziata l'assegnazione delle caratteristiche",  // CHARGEN.Message.AllocateCharacteristics
      "creato!"                                         // CHARGEN.Message.Created
    ];

    const isChargen = chargenPatterns.some(p => content.includes(p));
    if (!isChargen) return;

    // Se arrivi qui: sei un GIOCATORE, il filtro è attivo
    // e il messaggio è di CHARGEN → non lo vedi
    html.remove();
  });
});
