Hooks.once("ready", () => {

  // Usa il modulo solo con WFRP4e
  if (game.system.id !== "wfrp4e") return;

  const MODULE = "wfrp4e-chargen-gm-only";
  const KEY = "enabled";

  // Setting per accendere/spegnere il filtro
  if (!game.settings.settings.has(`${MODULE}.${KEY}`)) {
    game.settings.register(MODULE, KEY, {
      name: "Filtro CHARGEN (GM Only)",
      hint: "Se attivo, i messaggi di generazione PG non vengono mostrati ai giocatori.",
      scope: "world",
      config: true,
      type: Boolean,
      default: false
    });
  }

  console.log("[Chargen GM Only] Modulo inizializzato.");

  // Hook sul render della chat: gira su OGNI client
  Hooks.on("renderChatMessage", (message, html, data) => {
    const enabled = game.settings.get(MODULE, KEY);
    if (!enabled) return;

    // Il GM vede sempre tutto
    if (game.user.isGM) return;

    // TESTO VISIBILE nel messaggio, lato client
    const text = (html.text() || "").toLowerCase();

    // Flags WFRP4e, se presenti
    const wfFlags = message.flags?.wfrp4e || {};
    let flagDump = {};
    try {
      flagDump = JSON.parse(JSON.stringify(wfFlags));
    } catch (e) {
      flagDump = wfFlags;
    }

    // Debug: logga in console TUTTI i messaggi quando il filtro è attivo
    console.log("[Chargen GM Only] renderChatMessage (player)", {
      id: message.id,
      user: message.user?.name,
      text,
      flags: flagDump
    });

    // Heuristics sui flag: cerca "chargen" ovunque dentro flags.wfrp4e
    let isChargenFlag = false;
    for (const [k, v] of Object.entries(wfFlags)) {
      const kl = String(k).toLowerCase();
      if (kl.includes("chargen")) {
        isChargenFlag = true;
        break;
      }
      if (typeof v === "string" && v.toLowerCase().includes("chargen")) {
        isChargenFlag = true;
        break;
      }
    }

    // Pattern di testo basati sulle stringhe che hai riportato
    const chargenPatterns = [
      "ha iniziato la generazione del personaggio",     // CHARGEN.Message.Start
      "tirato:",                                        // CHARGEN.Message.Rolled
      "scegli:",                                        // CHARGEN.Message.Chosen
      "caratteristiche tirate",                         // CHARGEN.Message.RolledCharacteristics
      "caratteristiche ritirate",                       // CHARGEN.Message.ReRolledCharacteristics
      "scambiata",                                      // CHARGEN.Message.SwappedCharacteristics
      "iniziata l'assegnazione delle caratteristiche",  // CHARGEN.Message.AllocateCharacteristics
      " creato!"                                        // CHARGEN.Message.Created
    ];

    const isChargenText = chargenPatterns.some(p => text.includes(p));
    const isChargen = isChargenFlag || isChargenText;

    if (!isChargen) return;

    console.log("[Chargen GM Only] Messaggio CHARGEN nascosto al player:", {
      id: message.id,
      user: message.user?.name,
      text,
      flags: flagDump
    });

    // Nasconde il messaggio dalla chat del player
    html.remove();
  });
});
