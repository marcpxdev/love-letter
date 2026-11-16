# Love Letter Project

A simple, beautiful love letter experience built with HTML, CSS, and JavaScript.

## Overview

This project creates an interactive love letter experience that can be folded and unfolded, featuring:

- **Responsive design** that works on desktop and mobile
- **Smooth animations** for opening and unfolding the letter
- **Cursive typography** for a romantic feel
- **Wood background** theme to evoke warmth and intimacy

## Features

### Visual Design
- Cursive typography with Patrick Hand font family
- Responsive layout (full width on mobile, 50vw on desktop)
- Wood-themed design with realistic texture
- Justified body text for elegant typography
- Left-aligned titles, right-aligned signatures

### Interactivity
- Click-to-open envelope animation
- Smooth letter unfolding animation
- Reset button to close and reopen
- Mobile-friendly touch interactions

### Technical Implementation
- Vanilla JavaScript (no frameworks)
- Anime.js for animations
- Google Fonts for typography
- CSS custom properties for theming

## Project Structure

```
love-letter/
├── css/
│   ├── variables.css    # Theme variables and font imports
│   └── style.css        # Main styling
├── js/
│   ├── config.js        # Configuration and animation settings
│   ├── letter.js        # Letter content
│   └── script.js        # Application logic
├── images/
│   └── wood_bg.png      # Background texture
├── index.html           # Main HTML structure
└── .claude/            # Claude configuration
```

## Usage

1. Open `index.html` in a modern browser
2. Click the seal or envelope to open
3. Watch the letter unfold beautifully
4. Use the "Again" button to reset

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 14+
- Edge 79+
- Mobile browsers with CSS Grid and animation support

## Development

This project uses Claude Code and the Claude Agent SDK for development. Configuration is stored in the `.claude/` directory.

### Notes

- No build tools required - plain HTML/CSS/JS
- Optimized for mobile devices
- Uses CSS clamp for responsive typography