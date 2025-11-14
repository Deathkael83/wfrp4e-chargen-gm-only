Hooks.once("ready", () => {

  if (game.system.id !== "wfrp4e") return;

  const MODULE = "wfrp4e-chargen-gm-only";
  const KEY = "enabled";

  // Setting per accendere/spegnere il filtro
  if (!game.settings.settings.has(`${MODULE}.${KEY}`)) {
    game.settings.register(MODULE, KEY, {
      name: "Filtro CHARGEN (GM Only)",
      hint: "Se attivo, i messaggi della generazione PG saranno visibili solo ai GM.",
      scope: "world",
      config: true,
      type: Boolean,
      default: false
    });
  }

  Hooks.on("preCreateChatMessage", (doc, data, options, userId) => {

    const enabled = game.settings.get(MODULE, KEY);
    if (!enabled) return;

    if (data.whisper && data.whisper.length) return;

    const content = (data.content || "").toLowerCase();

    const isChargenFlag = data.flags?.wfrp4e?.chargen === true;

    const chargenPatterns = [
      "ha iniziato la generazione del personaggio",
      "tirato:",
      "scegli:",
      "caratteristiche tirate",
      "caratteristiche ritirate",
      "scambiata",
      "iniziata l'assegnazione delle caratteristiche",
      " creato!"
    ];

    const isChargenText = chargenPatterns.some(p => content.includes(p));

    const isChargen = isChargenFlag || isChargenText;
    if (!isChargen) return;

    const gmIds = game.users.filter(u => u.isGM).map(u => u.id);

    data.whisper = gmIds;
    data.blind = true;
  });
});
