# responsive-unfold-demo

This repo demonstrates how the tri-fold letter animation can adapt its timing to match different numbers of letter panels (paragraphs).

## Setup

This is a copy of [envelope-letter](https://github.com/brianlovin/envelope-letter) and includes all of its static files:
- `index.html`
- `css/variables.css`
- `css/style.css`
- `js/config.js`
- `js/script.js`
- `js/letter.js` — edit this file for your message

## The responsive change

In `js/script.js`, I changed the `showLetter()` function to calculate unfolding delays based on the panel count:

```js
const panelCount = panels.length;
const unfoldDelays = { 1: 0, 2: '-=100', 3: '-=300', 4: '-=500', 5: '-=700', 6: '-=900' };
```

Then each panel uses:
```js
}, unfoldDelays[panelCount] || `'-=${300 + (panelCount - 3) * 200}'`);
```

This replaces the hardcoded tri-fold pattern with a formula that scales as the letter grows longer.

## How it works

1. Seal shrinks away, flap opens, preview slides, envelope drops (same as before)
2. When the envelope drops away, `showLetter()` runs the unfold logic:
   - Panel 1 fades/scales in (500ms)
   - Remaining panels unfold from top to bottom with increasing offsets
   - The offset grows with panel count, so panels don't overlap

3. If you have only one panel, it appears immediately (no unfolding needed)

## Result

Now the letter adapts gracefully:

- 1–6 panels → preset delays
- 7+ panels → calculated `-=300 + (n-3)*200`

The animation remains smooth and readable regardless of how long your message is, and the tri-fold effect is no longer limited to exactly three panels.