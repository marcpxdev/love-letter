# Envelope Letter Website

A tiny, single-page website: the visitor sees a sealed envelope, taps it, the flap opens, the letter slides out, and then it **unfolds** (tri-fold style) into the full letter. Fully responsive.

- **Stack:** pure HTML + CSS + JavaScript, animated with [anime.js](https://animejs.com/) v3.2.1 (loaded from cdnjs)
- **No database, no build step, no framework**
- **Everything is separated into its own file:** structure, theme (colors and fonts), layout styles, letter content and settings, and animation logic

---

## 1. Project structure

```
envelope-letter/
├── index.html          <- page structure only
├── css/
│   ├── variables.css   <- colors, fonts, sizes (edit the look here)
│   └── style.css       <- layout and component styles
└── js/
    ├── config.js       <- letter text, icons and animation timings (edit the content here)
    └── script.js       <- builds the letter and runs the animation
```

## 2. Quick start

1. Create a folder called `envelope-letter` with the sub-folders `css` and `js`.
2. Create each file below with the exact name and location shown, and paste in its code.
3. Double-click `index.html` to open it in your browser. An internet connection is needed once to load anime.js and the Google Font.

---

## 3. `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>A Letter For You</title>

  <link rel="stylesheet" href="css/variables.css" />
  <link rel="stylesheet" href="css/style.css" />
</head>

<body>
  <main class="stage">

    <!-- ENVELOPE -->
    <div class="envelope" id="envelope">
      <div class="back"></div>
      <div class="preview" id="preview"></div>
      <div class="pocket"></div>
      <div class="flap" id="flap"></div>
      <button class="seal" id="seal" aria-label="Open the letter"></button>
    </div>
    <p class="hint" id="hint"></p>

    <!-- LETTER (panels are built by script.js from config.js) -->
    <article class="paper" id="paper"></article>

    <button class="again" id="again"></button>
  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
  <script src="js/config.js"></script>
  <script src="js/script.js"></script>
</body>
</html>
```

---

## 4. `css/variables.css`

Colors, fonts and sizes. Change the look of the whole site from this one file.

```css
/* Font (change the name in the URL to use another Google Font) */
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&display=swap");

:root {
  /* ----- Colors ----- */
  --bg-light:     #fbf4ea;   /* page background (center) */
  --bg:           #f3e9dc;   /* page background (edges) */
  --ink:          #3b2f2f;   /* text color */
  --accent:       #b23a48;   /* title color, seal */
  --accent-light: #d9586a;   /* seal highlight */

  --paper:        #fffdf7;   /* letter paper */

  --env:          #e8d2b0;   /* envelope main color */
  --env-light:    #efdcbc;   /* envelope front highlight */
  --env-flap:     #dfc79f;   /* flap highlight */
  --env-dark:     #cfb088;   /* envelope back (inside) */

  --shadow-color: rgba(60, 40, 20, 0.25);

  /* ----- Fonts ----- */
  --font-main: "Caveat", "Segoe Script", "Bradley Hand", cursive;

  --font-size-letter: clamp(1.2rem, 4.4vw, 1.5rem);
  --font-size-title:  1.9em;
  --font-size-hint:   1.3rem;
  --font-size-button: 1.3rem;
  --font-size-preview: clamp(1.4rem, 6vw, 2rem);
  --font-size-seal:   clamp(1.2rem, 4vw, 1.6rem);
  --line-height-letter: 1.65;

  /* ----- Sizes ----- */
  --envelope-width: min(88vw, 440px);
  --paper-width:    min(92vw, 520px);
  --seal-size:      clamp(44px, 12vw, 58px);
  --panel-padding:  clamp(18px, 5vw, 32px);
  --radius:         6px;
}
```

---

## 5. `css/style.css`

Layout and component styles. It uses only the variables above, so it rarely needs editing.

```css
* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px 0;
  background: radial-gradient(circle at 50% 30%, var(--bg-light), var(--bg));
  color: var(--ink);
  font-family: var(--font-main);
}

.stage {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

/* ---------- ENVELOPE ---------- */
.envelope {
  position: relative;
  width: var(--envelope-width);
  aspect-ratio: 3 / 2;
  cursor: pointer;
  perspective: 1000px;
  -webkit-tap-highlight-color: transparent;
}

.back {
  position: absolute;
  inset: 0;
  background: var(--env-dark);
  border-radius: var(--radius);
  box-shadow: 0 18px 40px var(--shadow-color);
}

/* small paper peeking out of the envelope */
.preview {
  position: absolute;
  left: 5%;
  top: 6%;
  width: 90%;
  height: 88%;
  z-index: 2;
  display: grid;
  place-items: center;
  background: var(--paper);
  border-radius: 4px;
  font-size: var(--font-size-preview);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* front of the envelope: everything except the top triangle */
.pocket {
  position: absolute;
  inset: 0;
  z-index: 3;
  border-radius: var(--radius);
  background: linear-gradient(160deg, var(--env-light), var(--env));
  clip-path: polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%);
}

/* the flap */
.flap {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 55%;
  z-index: 4;
  transform-origin: top center;
  background: linear-gradient(180deg, var(--env-flap), var(--env));
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}

.seal {
  position: absolute;
  left: 50%;
  top: 55%;
  translate: -50% -50%;            /* separate from anime's transform */
  z-index: 5;
  width: var(--seal-size);
  aspect-ratio: 1;
  border: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, var(--accent-light), var(--accent));
  color: #fff;
  font-size: var(--font-size-seal);
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.35);
}
.seal:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }

.hint {
  margin: 0;
  font-size: var(--font-size-hint);
  opacity: 0.7;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 50% { opacity: 0.25; } }

/* ---------- LETTER (tri-fold) ---------- */
.paper {
  display: none;
  width: var(--paper-width);
  perspective: 1600px;
  filter: drop-shadow(0 18px 30px var(--shadow-color));
}

.panel {
  position: relative;
  padding: var(--panel-padding);
  background: var(--paper);
  transform-origin: top center;
  backface-visibility: hidden;
  font-size: var(--font-size-letter);
  line-height: var(--line-height-letter);
}
.panel:first-child { border-radius: var(--radius) var(--radius) 0 0; }
.panel:last-child  { border-radius: 0 0 var(--radius) var(--radius); }

/* faint fold line at the top of panels 2 and 3 */
.panel + .panel::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 14px;
  background: linear-gradient(rgba(0, 0, 0, 0.07), transparent);
  pointer-events: none;
}

.panel h1 {
  margin: 0 0 0.4rem;
  font-size: var(--font-size-title);
  font-weight: 600;
  color: var(--accent);
}
.panel p { margin: 0 0 1rem; }
.panel p:last-child { margin-bottom: 0; }
.signature { text-align: right; font-size: 1.3em; }

.again {
  display: none;
  font: inherit;
  font-size: var(--font-size-button);
  padding: 0.35em 1.2em;
  border: 2px solid var(--ink);
  border-radius: 999px;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
}
.again:hover { background: var(--ink); color: var(--paper); }

@media (prefers-reduced-motion: reduce) {
  .hint { animation: none; }
}
```

---

## 6. `js/config.js`

The words in your letter, the text of the buttons, and the animation speeds. Edit your message here.

```js
const LETTER_CONFIG = {
  // ----- Texts -----
  previewText: "For you ♥",             // shown on the small paper inside the envelope
  sealIcon: "♥",                        // emoji or letter on the seal
  hintText: "Tap the envelope to open",
  againText: "Fold it back",

  // ----- The letter: 3 panels that unfold one after another -----
  panels: [
    {
      title: "Dear Friend,",
      paragraphs: [
        "I hope this letter finds you well. I wanted to write to you the old-fashioned way, with a little ink and a lot of heart."
      ]
    },
    {
      paragraphs: [
        "Thank you for being part of my life. Your kindness, your laughter, and your support have made even the hardest days feel lighter.",
        "Whatever comes next, I hope you remember how much you matter, and how proud I am of you."
      ]
    },
    {
      paragraphs: [
        "Until we meet again, take care of yourself and keep smiling."
      ],
      signature: "With love,\nYour Name"   // \n makes a new line
    }
  ],

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
```

---

## 7. `js/script.js`

Builds the letter from `config.js` and runs the animation. You normally don't need to edit this.

```js
(function () {
  const cfg = LETTER_CONFIG;
  const t = cfg.animation;

  const envelope = document.getElementById('envelope');
  const flap     = document.getElementById('flap');
  const seal     = document.getElementById('seal');
  const preview  = document.getElementById('preview');
  const hint     = document.getElementById('hint');
  const paper    = document.getElementById('paper');
  const again    = document.getElementById('again');

  // Speed things up for people who prefer reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) anime.speed = 4;

  /* ---------- Fill texts from config ---------- */
  preview.textContent = cfg.previewText;
  seal.textContent    = cfg.sealIcon;
  hint.textContent    = cfg.hintText;
  again.textContent   = cfg.againText;

  /* ---------- Build the letter panels ---------- */
  cfg.panels.forEach(function (data) {
    const section = document.createElement('section');
    section.className = 'panel';

    if (data.title) {
      const h1 = document.createElement('h1');
      h1.textContent = data.title;
      section.appendChild(h1);
    }

    (data.paragraphs || []).forEach(function (text) {
      const p = document.createElement('p');
      p.textContent = text;
      section.appendChild(p);
    });

    if (data.signature) {
      const sig = document.createElement('p');
      sig.className = 'signature';
      data.signature.split('\n').forEach(function (line, i) {
        if (i > 0) sig.appendChild(document.createElement('br'));
        sig.appendChild(document.createTextNode(line));
      });
      section.appendChild(sig);
    }

    paper.appendChild(section);
  });

  const panels = paper.querySelectorAll('.panel');
  let busy = false;

  /* ---------- Reset to the closed envelope ---------- */
  function resetState() {
    paper.style.display = 'none';
    paper.style.opacity = 1;
    again.style.display = 'none';
    envelope.style.display = '';
    hint.style.display = '';
    flap.style.zIndex = 4;

    anime.set('.flap',     { rotateX: 0 });
    anime.set('.preview',  { translateY: '0%' });
    anime.set('.envelope', { translateY: 0, opacity: 1 });
    anime.set('.seal',     { scale: 1, opacity: 1 });
    anime.set(panels[0],   { opacity: 0, scale: 0.92 });
    anime.set(Array.prototype.slice.call(panels, 1), { rotateX: -90 });
    busy = false;
  }

  /* ---------- Open the envelope ---------- */
  function openLetter() {
    if (busy) return;
    busy = true;
    hint.style.display = 'none';

    anime.timeline({ easing: 'easeInOutQuad' })
      // 1. Break the seal
      .add({ targets: seal, scale: 0, opacity: 0, duration: t.seal })
      // 2. Open the flap (send it behind the letter halfway through)
      .add({
        targets: flap,
        rotateX: 180,
        duration: t.flap,
        update: function (a) { if (a.progress > 50) flap.style.zIndex = 1; }
      })
      // 3. Slide the letter up
      .add({ targets: preview, translateY: '-60%', duration: t.slide })
      // 4. Drop the envelope away
      .add({
        targets: envelope,
        translateY: 90,
        opacity: 0,
        duration: t.drop,
        delay: 200,
        complete: showLetter
      });
  }

  /* ---------- Unfold the letter ---------- */
  function showLetter() {
    envelope.style.display = 'none';
    paper.style.display = 'block';

    const tl = anime.timeline({ easing: 'easeOutCubic' });

    // top panel fades/scales in
    tl.add({ targets: panels[0], opacity: 1, scale: 1, duration: 500 });

    // remaining panels unfold one after another
    for (let i = 1; i < panels.length; i++) {
      const isLast = i === panels.length - 1;
      tl.add({
        targets: panels[i],
        rotateX: 0,
        duration: t.unfold,
        easing: 'easeOutQuart',
        complete: isLast ? function () {
          again.style.display = 'inline-block';
          busy = false;
        } : undefined
      }, i === 1 ? '-=100' : '-=300');
    }

    // If the letter has only one panel, finish right away
    if (panels.length === 1) {
      again.style.display = 'inline-block';
      busy = false;
    }
  }

  /* ---------- Events ---------- */
  envelope.addEventListener('click', openLetter);

  again.addEventListener('click', function () {
    if (busy) return;
    busy = true;
    anime({
      targets: paper,
      opacity: 0,
      duration: t.fadeOut,
      easing: 'linear',
      complete: resetState
    });
  });

  resetState();
})();
```

---

## 8. Which file do I edit?

| I want to change... | Edit this file |
|---------------------|----------------|
| The words of the letter, signature, button text, seal icon | `js/config.js` |
| Animation speed | `js/config.js` (`animation` section) |
| Colors, fonts, font sizes, envelope and letter size | `css/variables.css` |
| Shapes, shadows, layout | `css/style.css` |
| Add a 4th panel (more paragraphs) | `js/config.js` (add another object to `panels`) |
| Page title | `index.html` |
| Animation steps themselves | `js/script.js` |

## 9. How the animation works

| Step | What happens | Technique |
|------|--------------|-----------|
| 1 | Seal shrinks away | anime.js `scale` + `opacity` |
| 2 | Flap opens | `rotateX: 180` around the top edge (CSS `perspective` on `.envelope`) |
| 3 | Letter slides out | `translateY: '-60%'` on `.preview` |
| 4 | Envelope drops and fades | `translateY` + `opacity` |
| 5 | Letter unfolds | stacked panels; panels 2 and 3 start at `rotateX(-90deg)` and swing open with `transform-origin: top` |

The envelope shape is made with `clip-path: polygon(...)`, so there are no images to load.

## 10. Responsiveness notes

- The envelope uses `min(88vw, 440px)` with `aspect-ratio: 3 / 2`, so it scales cleanly from small phones to large monitors.
- The letter uses `min(92vw, 520px)` and `clamp()` font sizes, so text stays readable.
- `min-height: 100dvh` keeps the layout correct with mobile browser toolbars, and a long letter simply scrolls.
- The `viewport` meta tag is required for mobile; it is already included.

## 11. Hosting for free (optional)

It's all static files, so you can host the folder on GitHub Pages, Netlify (drag and drop the folder) or Cloudflare Pages, then share the link with the person receiving the letter.
