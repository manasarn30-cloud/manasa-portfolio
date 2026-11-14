
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
