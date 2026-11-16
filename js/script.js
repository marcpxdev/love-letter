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

  /* ---------- Calculate responsive unfold behavior ---------- */
  const panelCount = panels.length;
  const unfoldDelays = { 1: 0, 2: '-=100', 3: '-=300', 4: '-=500', 5: '-=700', 6: '-=900' };

  /* ---------- Unfold the letter ---------- */
  function showLetter() {
    envelope.style.display = 'none';
    paper.style.display = 'block';

    const tl = anime.timeline({ easing: 'easeOutCubic' });

    // top panel fades/scales in
    tl.add({ targets: panels[0], opacity: 1, scale: 1, duration: 500 });

    // remaining panels unfold one after another based on count
    for (let i = 1; i < panelCount; i++) {
      const isLast = i === panelCount - 1;
      tl.add({
        targets: panels[i],
        rotateX: 0,
        duration: t.unfold,
        easing: 'easeOutQuart',
        complete: isLast ? function () {
          again.style.display = 'inline-block';
          busy = false;
        } : undefined
      }, unfoldDelays[panelCount] || `'-=${300 + (panelCount - 3) * 200}'`);
    }

    // If the letter has only one panel, finish right away
    if (panelCount === 1) {
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
