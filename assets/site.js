
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Reduced Motion Check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2. Sticky Navbar & Active States
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = Array.from(document.querySelectorAll('section'));
  
  const handleScroll = () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-links');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // 3. Spotlight Cards Hover Effect
  const cards = document.querySelectorAll('.spotlight-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 4. Scroll Reveal Animations (only if motion allowed)
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    
    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // If reduced motion, show everything immediately
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  // 5. Magnetic Buttons (only if motion allowed and on pointer devices)
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const magneticEls = document.querySelectorAll('.magnetic');
    
    magneticEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const strength = el.dataset.strength || 20;
        
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        el.style.transform = `translate(${x * (strength / 100)}px, ${y * (strength / 100)}px)`;
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // 6. Canvas Starfield
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Star config
    const starCount = 150; // Cap to 150 for smooth performance
    const stars = [];
    const colors = ['#fafafa', '#a1a1aa', '#3b82f6', '#ec4899']; // white, gray, blue, pink
    
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();
    
    // Initialize stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.8 + 0.2,
        alphaChange: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        speedY: Math.random() * 0.15 + 0.05
      });
    }
    
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      stars.forEach(star => {
        // Draw star glow
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha * 0.4; // Soften the glow
        ctx.fill();
        
        // Draw star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = star.alpha;
        ctx.fill();
        
        if (!prefersReducedMotion) {
          // Twinkle
          star.alpha += star.alphaChange;
          if (star.alpha <= 0.1 || star.alpha >= 1) {
            star.alphaChange *= -1;
            star.alpha = Math.max(0.1, Math.min(1, star.alpha));
          }
          
          // Gentle upward drift
          star.y -= star.speedY;
          if (star.y < -10) {
            star.y = height + 10;
            star.x = Math.random() * width;
          }
        }
      });
      ctx.globalAlpha = 1; // reset alpha for other ops
      
      if (!prefersReducedMotion && !document.hidden) {
        requestAnimationFrame(draw);
      }
    };
    
    // Start drawing loop (or just draw once if reduced motion)
    draw();
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !prefersReducedMotion) requestAnimationFrame(draw);
    });
  }

});

// Hide media sections whose images/videos are not uploaded yet
const cleanMedia = () => document.querySelectorAll('.media-block').forEach(b => { if (!b.querySelector('figure')) b.remove(); });
document.addEventListener('error', () => setTimeout(cleanMedia, 0), true);
window.addEventListener('load', () => setTimeout(cleanMedia, 0));

/* =====================================================================
   INTERACTION LAYER: pop-in cards, assignment pop-up, touch effects
   ===================================================================== */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const root = document.documentElement;

  /* ---- saved settings: theme, animation level, pop-up style, accent ---- */
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
    del: k => { try { localStorage.removeItem(k); } catch (e) {} }
  };
  const DEF = { theme: 'dark', motion: reduced ? 'off' : 'full', pop: 'zoom', accent: '' };
  const cfg = {
    theme: store.get('theme') || DEF.theme,
    motion: store.get('motion') || DEF.motion,
    pop: store.get('pop') || DEF.pop,
    accent: store.get('accent') || DEF.accent
  };
  const lvl = () => root.dataset.motion || 'full';
  const hex2rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
  const applyCfg = () => {
    root.dataset.theme = cfg.theme;
    root.dataset.motion = cfg.motion;
    root.dataset.pop = cfg.pop;
    if (cfg.accent) {
      root.style.setProperty('--accent', cfg.accent);
      root.style.setProperty('--accent-muted', hex2rgba(cfg.accent, .22));
    } else {
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-muted');
    }
  };
  applyCfg();

  /* ---- toast pop-up ---- */
  let toastEl, toastTimer;
  const toast = msg => {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(() => toastEl.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
  };

  /* ---- sparks that burst out of whatever you tap ---- */
  const SPARKS = ['var(--accent)', 'var(--accent-secondary)', '#ffffff', '#8b5cf6', '#facc15', '#f472b6'];
  const burst = (x, y, n = 12) => {
    if (lvl() !== 'full') return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, d = 45 + Math.random() * 85;
      const el = document.createElement('i');
      el.className = 'spark';
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.setProperty('--dx', Math.cos(a) * d + 'px');
      el.style.setProperty('--dy', Math.sin(a) * d + 'px');
      el.style.setProperty('--c', SPARKS[i % SPARKS.length]);
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }
  };

  /* ---- bubbles (visible in the Aero theme) ---- */
  const bubbles = document.createElement('div');
  bubbles.className = 'bubbles';
  bubbles.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 18; i++) {
    const b = document.createElement('i');
    b.className = 'bubble';
    b.style.setProperty('--x', (Math.random() * 96).toFixed(1) + '%');
    b.style.setProperty('--s', (14 + Math.random() * 46).toFixed(0) + 'px');
    b.style.setProperty('--t', (14 + Math.random() * 16).toFixed(1) + 's');
    b.style.setProperty('--d', '-' + (Math.random() * 24).toFixed(1) + 's');
    bubbles.appendChild(b);
  }
  document.body.appendChild(bubbles);

  /* ---- style panel: change theme, animations, pop-up style, accent ---- */
  const fab = document.createElement('button');
  fab.className = 'fab';
  fab.setAttribute('aria-label', 'Style settings');
  fab.setAttribute('aria-expanded', 'false');
  fab.innerHTML = '&#10022;';
  const panel0 = document.createElement('div');
  panel0.className = 'style-panel';
  panel0.setAttribute('role', 'dialog');
  panel0.setAttribute('aria-label', 'Style settings');
  const SW = [['#0a9fe0', 'Sky'], ['#8b5cf6', 'Violet'], ['#ec4899', 'Pink'], ['#22c55e', 'Green'], ['#f59e0b', 'Orange']];
  panel0.innerHTML = `
    <h3>Make it yours</h3>
    <p class="sub">Your choices are remembered on this device.</p>
    <div class="opt"><span>Theme</span><div class="seg" data-key="theme">
      <button data-v="dark">Dark</button><button data-v="aero">Frutiger Aero</button></div></div>
    <div class="opt"><span>Animations</span><div class="seg" data-key="motion">
      <button data-v="full">Full</button><button data-v="calm">Calm</button><button data-v="off">Off</button></div></div>
    <div class="opt"><span>Pop-up style</span><div class="seg" data-key="pop">
      <button data-v="zoom">Zoom</button><button data-v="flip">Flip</button><button data-v="bounce">Bounce</button><button data-v="slide">Slide</button></div></div>
    <div class="opt"><span>Accent colour</span><div class="swatches">
      <button class="swatch auto" data-c="" aria-label="Automatic accent colour"></button>
      ${SW.map(([c, n]) => `<button class="swatch" style="--c:${c}" data-c="${c}" aria-label="${n}"></button>`).join('')}</div></div>
    <button class="reset" type="button">Reset to default</button>`;
  document.body.append(panel0, fab);

  const syncPanel = () => {
    panel0.querySelectorAll('.seg').forEach(g => g.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === cfg[g.dataset.key])));
    panel0.querySelectorAll('.swatch').forEach(b => b.classList.toggle('on', b.dataset.c === cfg.accent));
  };
  const LABEL = { dark: 'Dark', aero: 'Frutiger Aero', full: 'Full', calm: 'Calm', off: 'Off', zoom: 'Zoom', flip: 'Flip', bounce: 'Bounce', slide: 'Slide' };
  const setCfg = (k, v, say) => {
    cfg[k] = v;
    store.set(k, v);
    applyCfg(); syncPanel();
    if (say) toast(say);
  };
  panel0.addEventListener('click', e => {
    const seg = e.target.closest('.seg button');
    if (seg) {
      const k = seg.parentElement.dataset.key;
      setCfg(k, seg.dataset.v, `${{ theme: 'Theme', motion: 'Animations', pop: 'Pop-up style' }[k]}: ${LABEL[seg.dataset.v]}`);
      const r = seg.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 8);
      return;
    }
    const sw = e.target.closest('.swatch');
    if (sw) {
      cfg.accent = sw.dataset.c;
      if (cfg.accent) store.set('accent', cfg.accent); else store.del('accent');
      applyCfg(); syncPanel();
      toast(cfg.accent ? 'Accent colour changed' : 'Accent colour: automatic');
      const r = sw.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 8);
      return;
    }
    if (e.target.closest('.reset')) {
      ['theme', 'motion', 'pop', 'accent'].forEach(k => store.del(k));
      Object.assign(cfg, { theme: DEF.theme, motion: DEF.motion, pop: DEF.pop, accent: DEF.accent });
      applyCfg(); syncPanel(); toast('Back to the default style');
    }
  });
  const setPanel = open => {
    panel0.classList.toggle('open', open);
    fab.setAttribute('aria-expanded', open);
    if (open) { syncPanel(); }
  };
  fab.addEventListener('click', e => { setPanel(!panel0.classList.contains('open')); const r = fab.getBoundingClientRect(); burst(r.left + 26, r.top + 26, 8); });
  document.addEventListener('pointerdown', e => { if (panel0.classList.contains('open') && !e.target.closest('.style-panel, .fab')) setPanel(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && panel0.classList.contains('open')) { setPanel(false); fab.focus(); } });
  syncPanel();

  /* ---- back-to-top button ---- */
  const toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML = '&#8593;';
  document.body.appendChild(toTop);
  toTop.addEventListener('click', e => { burst(e.clientX, e.clientY, 10); scrollTo({ top: 0, behavior: lvl() === 'off' ? 'auto' : 'smooth' }); });
  addEventListener('scroll', () => toTop.classList.toggle('show', root.scrollTop > 700), { passive: true });

  /* ---- section headings: words pop in one by one ---- */
  document.querySelectorAll('.section-header h2').forEach(h => {
    const words = h.textContent.trim().split(/\s+/);
    h.setAttribute('aria-label', h.textContent.trim());
    h.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true" style="--w:${i}">${w.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`).join(' ');
  });

  /* ---- page scroll progress bar ---- */
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  const onScroll = () => {
    const max = root.scrollHeight - root.clientHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, root.scrollTop / max) : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- soft glow that follows the cursor (mouse only) ---- */
  if (fine) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
    addEventListener('pointermove', e => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      glow.classList.add('on');
    }, { passive: true });
    document.addEventListener('pointerleave', () => glow.classList.remove('on'));
  }

  /* ---- ripple + sparks on press (mouse and touch) ---- */
  document.addEventListener('pointerdown', e => {
    if (lvl() === 'off') return;
    const host = e.target.closest('.btn, .task-link, .proj-card, .nav-links a, .skill-tag, .chip, .hero-graphic, .modal-foot a, .modal-foot button, .modal-btn');
    if (!host) return;
    if (host.matches('.btn, .proj-card, .skill-tag, .chip, .hero-graphic, .task-link')) burst(e.clientX, e.clientY, host.matches('.proj-card') ? 16 : 9);
    if (host.matches('.hero-graphic')) return;
    host.classList.add('ripple-host');
    const r = host.getBoundingClientRect();
    const dot = document.createElement('span');
    dot.className = 'ripple';
    dot.style.left = (e.clientX - r.left) + 'px';
    dot.style.top = (e.clientY - r.top) + 'px';
    host.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove());
  });

  /* ---- orbiting dots in the hero ---- */
  const heroGraphic = document.querySelector('.hero-graphic');
  if (heroGraphic) ['o1', 'o2', 'o3'].forEach(c => {
    const o = document.createElement('i');
    o.className = 'orbit ' + c;
    heroGraphic.appendChild(o);
  });

  /* ---- 3D tilt that follows the pointer (mouse only) ---- */
  if (fine) {
    document.querySelectorAll('.proj-card, .bento-item').forEach(c => {
      c.addEventListener('pointermove', e => {
        if (lvl() !== 'full' || c.classList.contains('pop-init') || c.classList.contains('pop-in')) return;
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateY(-4px)`;
      });
      c.addEventListener('pointerleave', () => { c.style.transform = ''; });
    });
  }

  /* ---- Projects: cards pop up one after another ---- */
  const cards = [...document.querySelectorAll('a.proj-card[href^="task"]')];
  const FX = ['pop', 'flip', 'spin', 'drop', 'slide'];
  if (cards.length && lvl() !== 'off' && 'IntersectionObserver' in window) {
    cards.forEach((c, i) => {
      c.classList.remove('reveal');
      c.dataset.fx = FX[i % FX.length];
      c.style.setProperty('--i', i);
      c.classList.add('pop-init');
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const c = en.target;
        io.unobserve(c);
        c.classList.remove('pop-init');
        c.classList.add('pop-in');
        c.addEventListener('animationend', () => c.classList.remove('pop-in'), { once: true });
      });
    }, { threshold: 0.15 });
    cards.forEach(c => io.observe(c));
  }

  /* ---- Assignment pop-up ---- */
  if (!cards.length) return;
  const tasks = cards.map(c => ({ href: c.getAttribute('href'), card: c }));
  const cache = {};
  let modal, panel, scroller, body, stepEl, prevBtn, nextBtn, prog;
  let current = -1, lastFocus = null;

  const build = () => {
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Assignment');
    modal.innerHTML = `
      <div class="modal-backdrop" data-close></div>
      <div class="modal-panel" tabindex="-1">
        <div class="modal-bar">
          <span class="modal-step"></span>
          <div class="modal-actions">
            <button class="modal-btn prev" aria-label="Previous assignment">&#8592;</button>
            <button class="modal-btn next" aria-label="Next assignment">&#8594;</button>
            <button class="modal-btn close" aria-label="Close" data-close>&#10005;</button>
          </div>
        </div>
        <div class="modal-progress"></div>
        <div class="modal-scroll"><div class="modal-doc"></div></div>
      </div>`;
    document.body.appendChild(modal);
    panel = modal.querySelector('.modal-panel');
    scroller = modal.querySelector('.modal-scroll');
    body = modal.querySelector('.modal-doc');
    stepEl = modal.querySelector('.modal-step');
    prevBtn = modal.querySelector('.prev');
    nextBtn = modal.querySelector('.next');
    prog = modal.querySelector('.modal-progress');
    modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
    prevBtn.addEventListener('click', () => open(current - 1));
    nextBtn.addEventListener('click', () => open(current + 1));
    scroller.addEventListener('scroll', () => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      prog.style.transform = `scaleX(${max > 0 ? scroller.scrollTop / max : 0})`;
    }, { passive: true });
    // links to other tasks inside a pop-up open that task
    body.addEventListener('click', e => {
      const a = e.target.closest('a[href^="task"]');
      if (!a) return;
      const i = tasks.findIndex(t => t.href === a.getAttribute('href'));
      if (i > -1) { e.preventDefault(); open(i); }
    });
    // keyboard: Esc closes, arrows switch, Tab stays inside
    addEventListener('keydown', e => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight' && !e.target.closest('input,textarea')) open(current + 1);
      else if (e.key === 'ArrowLeft' && !e.target.closest('input,textarea')) open(current - 1);
      else if (e.key === 'Tab') {
        const f = [...panel.querySelectorAll('a[href],button:not([disabled]),summary')].filter(x => x.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  };

  const fetchTask = async href => {
    if (cache[href]) return cache[href];
    const res = await fetch(href);
    if (!res.ok) throw new Error(res.status);
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    const main = doc.querySelector('main.doc');
    if (!main) throw new Error('no content');
    main.querySelectorAll('.task-hero .back-link, .task-nav').forEach(n => n.remove());
    cache[href] = main.innerHTML;
    return cache[href];
  };

  const open = async (i, push) => {
    if (i < 0 || i >= tasks.length) return;
    if (!modal) build();
    const wasOpen = modal.classList.contains('open');
    const t = tasks[i];
    current = i;
    if (!wasOpen) lastFocus = document.activeElement;
    stepEl.innerHTML = `Assignment <b>${i + 1}</b> of ${tasks.length}`;
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === tasks.length - 1;
    body.innerHTML = '<div class="modal-loading">Loading assignment…</div>';
    scroller.scrollTop = 0;
    // pop-up grows out of the card that was clicked
    if (!wasOpen) {
      if (cfg.pop === 'zoom' && lvl() !== 'off') {
        const r = t.card.getBoundingClientRect();
        panel.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
      } else panel.style.transformOrigin = '';
    }
    modal.classList.add('open');
    root.classList.add('modal-open');
    panel.focus({ preventScroll: true });

    const hash = '#task' + (i + 1);
    if (push !== false) {
      if (wasOpen) history.replaceState({ task: i }, '', hash);
      else history.pushState({ task: i }, '', hash);
    }
    try {
      const html = await fetchTask(t.href);
      if (current !== i) return;                       // user already moved on
      body.innerHTML = html;
      const prev = tasks[i - 1], next = tasks[i + 1];
      const foot = document.createElement('div');
      foot.className = 'modal-foot';
      foot.innerHTML =
        (prev ? `<button type="button" data-go="${i - 1}">&larr; Previous assignment</button>` : '<span></span>') +
        `<a href="${t.href}">Open as a full page</a>` +
        (next ? `<button type="button" data-go="${i + 1}">Next assignment &rarr;</button>` : '<span></span>');
      body.appendChild(foot);
      foot.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => open(+b.dataset.go)));
      [...body.querySelectorAll('.doc-section')].slice(0, 8).forEach((s, k) => s.style.setProperty('--i', k));
      setTimeout(() => { if (typeof cleanMedia === 'function') cleanMedia(); }, 800);
    } catch (err) {
      // e.g. opened from a local file: fall back to the normal page
      location.href = t.href;
    }
  };

  const close = () => {
    if (!modal || !modal.classList.contains('open')) return;
    modal.classList.remove('open');
    root.classList.remove('modal-open');
    if (history.state && history.state.task != null) history.back();
    else history.replaceState(null, '', location.pathname + '#projects');
    current = -1;
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };

  cards.forEach((c, i) => c.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;   // allow open-in-new-tab
    e.preventDefault();
    open(i);
  }));

  // browser Back/Forward and deep links like index.html#task3
  const fromHash = () => {
    const m = /^#task([1-9])$/.exec(location.hash);
    if (m && +m[1] <= tasks.length) open(+m[1] - 1, false);
    else if (modal && modal.classList.contains('open')) {
      modal.classList.remove('open'); root.classList.remove('modal-open'); current = -1;
    }
  };
  addEventListener('popstate', fromHash);
  fromHash();

  // one-time hint
  if (!store.get('hint')) setTimeout(() => {
    if (cards.length && !modal) { toast('Tip: tap an assignment card to pop it open \u2726'); store.set('hint', '1'); }
  }, 3500);
})();
