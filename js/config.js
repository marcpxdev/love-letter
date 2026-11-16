const LETTER_CONFIG = {
  // ----- Texts -----
  previewText: "For you ♥",             // shown on the small paper inside the envelope
  sealIcon: "♥",                        // emoji or letter on the seal
  hintText: "Tap the envelope to open",
  againText: "Fold it back",

  // ----- The letter: 3 panels that unfold one after another -----
  // Text lives in js/letter.js (LETTER_CONTENT.panels). Edit your message there.
  panels: LETTER_CONTENT.panels,

  // ----- Animation timings (milliseconds) -----
  animation: {
    seal: 300,        // seal shrinks away
    flap: 700,        // flap opens
    slide: 700,       // letter slides out
    drop: 500,        // envelope drops and fades
    unfold: 800,      // each panel unfolds
    fadeOut: 400      // letter fades when you press "Fold it back"
  }
};
