// ==========================================================================
// Pranath Jain Profile App Logic (Premium Framer Replica Motion Graphics)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScrolling();
  setupScrollReveals();
  setupHeroEntrance();
  setupPremiumFloatingCollage();
  setupAboutFloatingAnnotations();
  logSystemStatus();
});

// 1. Smooth Scroll to Anchors
function setupSmoothScrolling() {
  const links = document.querySelectorAll('.nav-link');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          history.pushState(null, null, href);
        }
      }
    });
  });
}

// 2. Viewport Scroll Reveals using GSAP ScrollTrigger
function setupScrollReveals() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback if GSAP is not loaded
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('reveal-visible'));
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  revealElements.forEach(el => {
    gsap.fromTo(el, 
      {
        opacity: 0,
        y: 40
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true
        }
      }
    );
  });
}

// 3. Hero Title Entrance Reveals on Load (GSAP timeline)
function setupHeroEntrance() {
  if (typeof gsap === 'undefined') {
    // Fallback if GSAP is not loaded
    const heroName = document.querySelector('.hero-name');
    const heroCursive = document.querySelector('.hero-cursive-title');
    if (heroName) heroName.classList.add('visible');
    if (heroCursive) heroCursive.classList.add('visible');
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // 1. Header Navigation slide down
  tl.fromTo('.header-nav', 
    { opacity: 0, y: -30 }, 
    { opacity: 1, y: 0, duration: 1 }
  );

  // 2. Hero Name Title slide up
  if (document.querySelector('.hero-name')) {
    tl.fromTo('.hero-name', 
      { opacity: 0, y: 60 }, 
      { opacity: 1, y: 0, duration: 1.1 },
      "-=0.7"
    );
  }

  // 3. Hero Cursive subtitle swing in
  if (document.querySelector('.hero-cursive-title')) {
    tl.fromTo('.hero-cursive-title', 
      { opacity: 0, rotation: 10, y: 30 }, 
      { opacity: 1, rotation: -2, y: 0, duration: 0.9, ease: "back.out(1.2)" },
      "-=0.7"
    );
  }

  // 4. Intro text block reveal
  if (document.querySelector('.intro-statement-text')) {
    tl.fromTo('.intro-statement-text', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.5"
    );
  }
}

// 4. Premium Inertia-based Floating Collage with Parallax
function setupPremiumFloatingCollage() {
  const container = document.getElementById('collage-container');
  if (!container) return;
  
  // Collage element definitions with individual coordinates, intensity, and parallax physics
  const items = [
    {
      el: container.querySelector('.crumpled-paper'),
      baseRotation: 76,
      xIntensity: 12,
      yIntensity: 10,
      scrollFactor: -0.06, // Drift slower
      staggerDelay: 100,
      hoverScale: 1.03,
      hoverRotationOffset: 2
    },
    {
      el: container.querySelector('.cursive-slip'),
      baseRotation: 75,
      xIntensity: -15,
      yIntensity: -12,
      scrollFactor: -0.08,
      staggerDelay: 250,
      hoverScale: 1.05,
      hoverRotationOffset: -3
    },
    {
      el: container.querySelector('.barcode-receipt'),
      baseRotation: 97,
      xIntensity: 18,
      yIntensity: 14,
      scrollFactor: 0.05,
      staggerDelay: 400,
      hoverScale: 1.04,
      hoverRotationOffset: 4
    },
    {
      el: container.querySelector('.polaroid-card'),
      baseRotation: -12, // rotated left tilt
      xIntensity: -22,
      yIntensity: -20,
      scrollFactor: 0.03,
      staggerDelay: 550,
      hoverScale: 1.06,
      hoverRotationOffset: -5
    },
    {
      el: container.querySelector('.red-flower'),
      baseRotation: 75,
      xIntensity: 28,
      yIntensity: 24,
      scrollFactor: 0.12,
      staggerDelay: 700,
      hoverScale: 1.15,
      hoverRotationOffset: 8
    },
    {
      el: container.querySelector('.safety-pin'),
      baseRotation: -12, // subtle safety pin rotation
      xIntensity: 35,
      yIntensity: 28,
      scrollFactor: 0.15,
      staggerDelay: 800,
      hoverScale: 1.12,
      hoverRotationOffset: -4
    }
  ];

  // Initialize interactive physical values
  const physics = {
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    scrollY: 0,
    targetScrollY: 0
  };

  // Track Mouse Input (Normalized -1 to 1)
  window.addEventListener('mousemove', (e) => {
    physics.targetMouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    physics.targetMouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
  });

  // Track Scroll
  window.addEventListener('scroll', () => {
    physics.targetScrollY = window.pageYOffset || document.documentElement.scrollTop;
  });

  // Setup scale entrance delays & hover tracking
  items.forEach(item => {
    if (!item.el) return;
    
    // Start collapsed
    item.scale = 0;
    item.targetScale = 0;
    item.currentX = 0;
    item.currentY = 0;
    item.dragX = 0;
    item.dragY = 0;
    item.isDragging = false;
    item.currentRotation = item.baseRotation;
    item.isHovered = false;
    
    // Staggered pop-in
    setTimeout(() => {
      item.targetScale = 1.0;
    }, item.staggerDelay);

    // Dragging mechanics (Mouse & Touch support)
    let startX = 0;
    let startY = 0;
    let initialDragX = 0;
    let initialDragY = 0;

    const startDrag = (clientX, clientY) => {
      item.isDragging = true;
      startX = clientX;
      startY = clientY;
      initialDragX = item.dragX;
      initialDragY = item.dragY;
      
      // Bring active card to top
      items.forEach(i => {
        if (i.el) i.el.style.zIndex = '3';
      });
      item.el.style.zIndex = '15';
      item.el.style.cursor = 'grabbing';
    };

    const moveDrag = (clientX, clientY) => {
      if (!item.isDragging) return;
      const dx = clientX - startX;
      const dy = clientY - startY;
      item.dragX = initialDragX + dx;
      item.dragY = initialDragY + dy;
    };

    const stopDrag = () => {
      if (item.isDragging) {
        item.isDragging = false;
        item.el.style.cursor = 'grab';
      }
    };

    item.el.style.cursor = 'grab';
    item.el.style.userSelect = 'none';

    // Mouse events
    item.el.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      if (item.isDragging) {
        moveDrag(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseup', () => {
      stopDrag();
    });

    // Touch events for mobile/tablet
    item.el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (item.isDragging && e.touches.length === 1) {
        moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      stopDrag();
    });

    // Mouse hover listeners to inject scale-up and wiggles
    item.el.addEventListener('mouseenter', () => {
      item.isHovered = true;
    });
    item.el.addEventListener('mouseleave', () => {
      item.isHovered = false;
    });
  });

  // Physics Animation Loop
  function updateCollage() {
    const lerpFactor = 0.08; // Friction factor (lower = smoother/laggier)
    
    // Interpolate mouse coordinates (adds drag/inertia)
    physics.mouseX += (physics.targetMouseX - physics.mouseX) * lerpFactor;
    physics.mouseY += (physics.targetMouseY - physics.mouseY) * lerpFactor;
    
    // Interpolate scroll (liquid scroll parallax)
    physics.scrollY += (physics.targetScrollY - physics.scrollY) * lerpFactor;

    items.forEach(item => {
      if (!item.el) return;

      // 1. Calculate Target Coordinates from Mouse Parallax
      const targetX = physics.mouseX * item.xIntensity;
      const targetY = physics.mouseY * item.yIntensity;

      // 2. Add Scroll Parallax Offset
      const scrollOffset = physics.scrollY * item.scrollFactor;
      const finalTargetY = targetY + scrollOffset;

      // 3. Hover Target Scales and Rotations
      const targetScaleVal = item.isHovered ? item.hoverScale : item.targetScale;
      const targetRotVal = item.isHovered ? (item.baseRotation + item.hoverRotationOffset) : item.baseRotation;

      // 4. Smoothly Interpolate Current values to Targets
      item.currentX += (targetX - item.currentX) * lerpFactor;
      item.currentY += (finalTargetY - item.currentY) * lerpFactor;
      item.scale += (targetScaleVal - item.scale) * lerpFactor;
      item.currentRotation += (targetRotVal - item.currentRotation) * lerpFactor;

      // 5. Apply inline CSS Matrix Transform
      // Combine translation, scaling, rotation, and drag offsets cleanly
      const xVal = item.currentX + item.dragX;
      const yVal = item.currentY + item.dragY;
      item.el.style.transform = `translate(${xVal}px, ${yVal}px) scale(${item.scale}) rotate(${item.currentRotation}deg)`;
    });

    requestAnimationFrame(updateCollage);
  }

  // Kickoff loop
  requestAnimationFrame(updateCollage);
}

// 5. About Section Floating Annotations (Coffee tags shift subtly)
function setupAboutFloatingAnnotations() {
  const annotations = document.querySelectorAll('.about-left .handwritten-note');
  if (annotations.length === 0) return;

  const physics = {
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0
  };

  window.addEventListener('mousemove', (e) => {
    // Shorter bounding box tracking for profile
    physics.targetMouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    physics.targetMouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
  });

  function updateAnnotations() {
    const lerpFactor = 0.05;
    physics.mouseX += (physics.targetMouseX - physics.mouseX) * lerpFactor;
    physics.mouseY += (physics.targetMouseY - physics.mouseY) * lerpFactor;

    annotations.forEach((note, index) => {
      const isFirst = index === 0;
      const driftX = physics.mouseX * (isFirst ? 14 : -12);
      const driftY = physics.mouseY * (isFirst ? 10 : -8);
      const baseRot = isFirst ? 8 : -4; // Matching style.css rotation coordinates

      note.style.transform = `translate(${driftX}px, ${driftY}px) rotate(${baseRot}deg)`;
    });

    requestAnimationFrame(updateAnnotations);
  }

  requestAnimationFrame(updateAnnotations);
}

// 6. Log initialized system status
function logSystemStatus() {
  console.log(
    "%c PRANATH JAIN INSTANCE ACTIVE ",
    "background: #f44d38; color: #f7f3ec; font-weight: 700; padding: 6px 12px; border-radius: 4px;"
  );
}


