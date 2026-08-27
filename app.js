/**
 * MacBook Pro Landing Page - Core Interactive Engine
 * Frame Animation, Web Audio Synthesizer, Live Benchmarks, Display Simulator,
 * Thermal Canvas, Keyboard Simulator, and Hardware Configurator.
 */

(function () {
  'use strict';

  // ==========================================
  // CONFIGURATION
  // ==========================================
  const CONFIG = {
    frameCount: 240,
    framePrefix: 'frames/ezgif-frame-',
    frameExt: '.jpg',
    lerpFactor: 0.08,
    defaultPrice: 2899,
  };

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const state = {
    isReady: false,
    images: [],
    loadedCount: 0,
    targetFrame: 0,
    currentFrame: 0,
    lastRenderedIndex: -1,
    isPlaying: false,
    playDirection: 1,
    audioEnabled: true,
    inHeroSection: true,
    
    // Configurator state
    config: {
      size: '14',
      chip: 'm4max',
      ram: '64',
      storage: '1tb',
      sizePrice: 0,
      chipPrice: 900,
      ramPrice: 400,
      storagePrice: 0,
      basePrice: 1599,
    },
    
    // Benchmark state
    selectedChip: 'm4max',
    selectedTask: 'video',

    // Thermal simulation state
    thermalLoad: 10,
    thermalParticles: [],
  };

  // ==========================================
  // NATIVE WEB AUDIO API SYNTHESIZER
  // ==========================================
  class AudioEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.isMuted = false;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.value = 0.25;
          this.masterGain.connect(this.ctx.destination);
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.ctx.currentTime);
      }
      return !this.isMuted;
    }

    // Subtle Apple UI Click
    playClick(freq = 1200) {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    }

    // Mechanical Scissor Switch Keyboard Click
    playKeyClick() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // High transient click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400 + Math.random() * 300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.02);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.025);

      // Low tactile bottom-out thud
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.04);
      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      subOsc.connect(subGain);
      subGain.connect(this.masterGain);
      subOsc.start(now);
      subOsc.stop(now + 0.04);
    }

    // Force Touch & Touch ID Haptic Pulse
    playHapticThud() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.09);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.09);
    }

    // Polyphonic Spatial Harmonic Chord
    playSpatialChord(rootFreq = 440) {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [rootFreq, rootFreq * 1.25, rootFreq * 1.5, rootFreq * 1.875]; // Major 7th harmonic

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const pan = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        if (pan) {
          pan.pan.setValueAtTime((idx / (notes.length - 1)) * 1.6 - 0.8, now);
        }

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.15, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

        if (pan) {
          osc.connect(pan);
          pan.connect(gain);
        } else {
          osc.connect(gain);
        }
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 1.65);
      });
    }
  }

  const audio = new AudioEngine();

  // ==========================================
  // DOM ELEMENTS
  // ==========================================
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderText = document.getElementById('loader-text');
  const loaderStatus = document.getElementById('loader-status');
  
  // Cursor
  const cursorDot = document.getElementById('custom-cursor');
  const cursorFollower = document.getElementById('custom-cursor-follower');

  // Nav & Progress
  const headerProgress = document.getElementById('header-progress');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundOnIcon = soundToggleBtn.querySelector('.sound-on-icon');
  const soundOffIcon = soundToggleBtn.querySelector('.sound-off-icon');
  const soundToast = document.getElementById('sound-toast');
  const soundToastText = document.getElementById('sound-toast-text');
  const navLinks = document.querySelectorAll('.nav-link');

  // Story Panels
  const storyPanels = [
    document.getElementById('panel-1'),
    document.getElementById('panel-2'),
    document.getElementById('panel-3'),
    document.getElementById('panel-4'),
  ];
  const hotspotsLayer = document.getElementById('hotspots-layer');
  const scrubHud = document.getElementById('scrub-hud');

  // HUD Elements
  const hudPlayBtn = document.getElementById('hud-play-btn');
  const hudPlayIcon = document.getElementById('hud-play-icon');
  const hudPauseIcon = document.getElementById('hud-pause-icon');
  const hudScrubSlider = document.getElementById('hud-scrub-slider');
  const hudPercentage = document.getElementById('hud-percentage');
  const hudCheckpointTags = document.querySelectorAll('.hud-tag');

  // Finish Studio Elements
  const finishPillBtns = document.querySelectorAll('.color-pill-btn');
  const finishHalo = document.getElementById('finish-halo');
  const finishDeviceCard = document.getElementById('finish-device-card');
  const finishModelText = document.getElementById('finish-model-text');
  const finishDynamicDesc = document.getElementById('finish-dynamic-desc');

  // Benchmark Elements
  const chipTabBtns = document.querySelectorAll('.chip-tab-btn');
  const dieChipTitle = document.getElementById('die-chip-title');
  const dieGlow = document.getElementById('die-glow');
  const taskPills = document.querySelectorAll('.task-pill');
  const barM4Label = document.getElementById('bar-m4-label');
  const barM4Val = document.getElementById('bar-m4-val');
  const barM4Fill = document.getElementById('bar-m4-fill');
  const barM1Val = document.getElementById('bar-m1-val');
  const barM1Fill = document.getElementById('bar-m1-fill');
  const barI9Val = document.getElementById('bar-i9-val');
  const barI9Fill = document.getElementById('bar-i9-fill');
  const barI9BatteryVal = document.getElementById('bar-i9-battery-val');
  const barI9BatteryFill = document.getElementById('bar-i9-battery-fill');
  const benchmarkDescText = document.getElementById('benchmark-desc-text');

  // Display Sim Elements
  const nitsSlider = document.getElementById('nits-slider');
  const nitsVal = document.getElementById('nits-val');
  const hdrSunFlare = document.getElementById('hdr-sun-flare');
  const displayScreenGlass = document.getElementById('display-screen-glass');
  const toggleMiniledBtn = document.getElementById('toggle-miniled-btn');
  const miniLedGrid = document.getElementById('mini-led-grid');
  const toggleNanoBtn = document.getElementById('toggle-nano-btn');
  const nanoGlareOverlay = document.getElementById('nano-glare-overlay');

  // Thermal & Acoustics Elements
  const thermalCanvas = document.getElementById('thermal-canvas');
  const thermalCtx = thermalCanvas.getContext('2d');
  const thermalLoadSlider = document.getElementById('thermal-load-slider');
  const thermalLoadPills = document.querySelectorAll('.load-pill');
  const thermalTemp = document.getElementById('thermal-temp');
  const thermalRpm = document.getElementById('thermal-rpm');
  const thermalNoise = document.getElementById('thermal-noise');
  const audioStage = document.getElementById('audio-stage');
  const spatialPlayBtn = document.getElementById('spatial-audio-play-btn');
  const chordBtns = document.querySelectorAll('.chord-btn');

  // Keyboard Elements
  const keyboardLightSlider = document.getElementById('keyboard-light-slider');
  const keyboardLightVal = document.getElementById('keyboard-light-val');
  const touchidTrigger = document.getElementById('touchid-trigger');
  const touchidStatusText = document.getElementById('touchid-status-text');
  const keyCaps = document.querySelectorAll('.key-cap');
  const trackpadSim = document.getElementById('trackpad-sim');

  // Ports Elements
  const portSockets = document.querySelectorAll('.port-socket');
  const portInfoText = document.getElementById('port-info-text');

  // Configurator Elements
  const configChoiceCards = document.querySelectorAll('.config-choice-card');
  const summaryDeviceTitle = document.getElementById('summary-device-title');
  const sumChip = document.getElementById('sum-chip');
  const sumRam = document.getElementById('sum-ram');
  const sumStorage = document.getElementById('sum-storage');
  const sumDisplay = document.getElementById('sum-display');
  const configTotalPrice = document.getElementById('config-total-price');
  const configMonthlyPrice = document.getElementById('config-monthly-price');
  const addToBagBtn = document.getElementById('add-to-bag-btn');

  // Checkout Modal
  const checkoutModal = document.getElementById('checkout-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');
  const modalSummaryText = document.getElementById('modal-summary-text');
  const modalTotalPrice = document.getElementById('modal-total-price');

  // ==========================================
  // 1. FRAME RENDERING & HIGH-DPI CANVAS
  // ==========================================
  function getFramePath(index) {
    const numStr = String(index).padStart(3, '0');
    return `${CONFIG.framePrefix}${numStr}${CONFIG.frameExt}`;
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    if (state.isReady) {
      const frameIndex = Math.min(CONFIG.frameCount - 1, Math.max(0, Math.round(state.currentFrame)));
      renderFrame(frameIndex);
    }
  }

  function renderFrame(index) {
    const img = state.images[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasW = canvas.width / dpr;
    const canvasH = canvas.height / dpr;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    const scale = Math.max(canvasW / imgW, canvasH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const drawX = (canvasW - drawW) / 2;
    const drawY = (canvasH - drawH) / 2;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  }

  function updateStoryMilestones(frameIndex, progress) {
    // If scrolled past the hero scrub section, deactivate all panels
    if (!state.inHeroSection || progress >= 0.98) {
      storyPanels.forEach(panel => {
        if (panel) panel.classList.remove('active');
      });
      if (hotspotsLayer) hotspotsLayer.classList.remove('visible');
      if (scrubHud) scrubHud.style.opacity = '0';
      return;
    }

    if (scrubHud) scrubHud.style.opacity = '1';

    // Milestones mapping:
    // 0 to 45: Panel 1
    // 45 to 110: Panel 2
    // 110 to 175: Panel 3
    // 175 to 239: Panel 4
    let activePanelIndex = -1;
    if (frameIndex < 45) {
      activePanelIndex = 0;
    } else if (frameIndex < 110) {
      activePanelIndex = 1;
    } else if (frameIndex < 175) {
      activePanelIndex = 2;
    } else {
      activePanelIndex = 3;
    }

    storyPanels.forEach((panel, idx) => {
      if (panel) {
        if (idx === activePanelIndex) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      }
    });

    // Hotspots appear at exploded stage (frame >= 175)
    if (hotspotsLayer) {
      if (frameIndex >= 175) {
        hotspotsLayer.classList.add('visible');
      } else {
        hotspotsLayer.classList.remove('visible');
      }
    }

    // Update HUD Scrubber position & percent
    if (hudScrubSlider && document.activeElement !== hudScrubSlider) {
      hudScrubSlider.value = frameIndex;
    }
    if (hudPercentage) {
      const pct = Math.round((frameIndex / (CONFIG.frameCount - 1)) * 100);
      hudPercentage.textContent = `${pct}%`;
    }

    // Checkpoint active state
    hudCheckpointTags.forEach(tag => {
      const target = parseInt(tag.dataset.targetFrame, 10);
      if (Math.abs(frameIndex - target) < 25) {
        tag.classList.add('active');
      } else {
        tag.classList.remove('active');
      }
    });
  }

  function updateScroll() {
    const heroSection = document.getElementById('hero-story');
    const scrollTrack = document.getElementById('scroll-track');
    if (!heroSection || !scrollTrack) return;

    const heroRect = heroSection.getBoundingClientRect();
    const trackRect = scrollTrack.getBoundingClientRect();
    
    // Check if hero is currently in view
    state.inHeroSection = heroRect.bottom > 0 && heroRect.top < window.innerHeight;

    const totalScroll = trackRect.height;
    const currentScrolled = -heroRect.top;
    
    let progress = 0;
    if (totalScroll > 0) {
      progress = Math.max(0, Math.min(1, currentScrolled / totalScroll));
    }

    if (!state.isPlaying) {
      state.targetFrame = progress * (CONFIG.frameCount - 1);
    }

    // Header global scroll progress
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const globalProgress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    if (headerProgress) {
      headerProgress.style.width = `${globalProgress}%`;
    }

    // Section spy for navigation links
    const sections = document.querySelectorAll('section[id]');
    let currentActiveSection = '';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) {
        currentActiveSection = sec.getAttribute('id');
      }
    });

    if (currentActiveSection) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentActiveSection}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  function animationLoop() {
    if (state.isReady) {
      // Auto-play mode handling
      if (state.isPlaying) {
        state.targetFrame += 0.8 * state.playDirection;
        if (state.targetFrame >= CONFIG.frameCount - 1) {
          state.targetFrame = CONFIG.frameCount - 1;
          state.playDirection = -1;
        } else if (state.targetFrame <= 0) {
          state.targetFrame = 0;
          state.playDirection = 1;
        }
      }

      // Smooth lerp
      const delta = state.targetFrame - state.currentFrame;
      if (Math.abs(delta) > 0.0001) {
        state.currentFrame += delta * CONFIG.lerpFactor;
      } else {
        state.currentFrame = state.targetFrame;
      }

      const frameIndex = Math.min(CONFIG.frameCount - 1, Math.max(0, Math.round(state.currentFrame)));
      const progress = frameIndex / (CONFIG.frameCount - 1);

      if (frameIndex !== state.lastRenderedIndex) {
        renderFrame(frameIndex);
        updateStoryMilestones(frameIndex, progress);
        state.lastRenderedIndex = frameIndex;
      }
    }

    requestAnimationFrame(animationLoop);
  }

  function preloadImages() {
    return new Promise((resolve) => {
      const statuses = [
        'Initializing Neural Core...',
        'Loading 240 HDR Disassembly Layers...',
        'Aligning Liquid Retina XDR Frames...',
        'Compiling M4 Max Architecture...',
        'Ready.'
      ];

      for (let i = 1; i <= CONFIG.frameCount; i++) {
        const img = new Image();
        const frameIdx = i - 1;

        img.onload = () => {
          state.loadedCount++;
          const percent = Math.round((state.loadedCount / CONFIG.frameCount) * 100);
          if (loaderBar) loaderBar.style.width = `${percent}%`;
          if (loaderText) loaderText.textContent = `${percent}%`;
          
          const statusIdx = Math.min(statuses.length - 1, Math.floor((percent / 100) * statuses.length));
          if (loaderStatus) loaderStatus.textContent = statuses[statusIdx];

          if (frameIdx === 0 && !state.isReady) {
            renderFrame(0);
          }

          if (state.loadedCount === CONFIG.frameCount) {
            resolve();
          }
        };

        img.onerror = () => {
          state.loadedCount++;
          if (state.loadedCount === CONFIG.frameCount) {
            resolve();
          }
        };

        img.src = getFramePath(i);
        state.images.push(img);
      }
    });
  }

  // ==========================================
  // 2. MAGNETIC CURSOR & FOLLOWER
  // ==========================================
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  function initCursor() {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) {
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    }, { passive: true });

    function renderFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      if (cursorFollower) {
        cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      }
      requestAnimationFrame(renderFollower);
    }
    requestAnimationFrame(renderFollower);

    // Magnetic hover targets
    const interactives = document.querySelectorAll('button, a, .hotspot, .key-cap, .color-pill-btn, .config-choice-card, .port-socket, input[type="range"]');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (cursorFollower) cursorFollower.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        if (cursorFollower) cursorFollower.classList.remove('hovering');
      });
    });
  }

  // ==========================================
  // 3. COLOR & FINISH STUDIO
  // ==========================================
  const finishProfiles = {
    'space-black': {
      name: 'Space Black',
      desc: 'A dark, menacing aluminum finish featuring a groundbreaking anodization seal to dramatically reduce fingerprints.',
      gradient: 'linear-gradient(145deg, #1c1d21, #0a0b0d)',
      halo: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
      border: 'rgba(255, 255, 255, 0.18)',
    },
    'silver': {
      name: 'Silver',
      desc: 'The iconic, radiant Apple metallic finish that reflects pure studio elegance.',
      gradient: 'linear-gradient(145deg, #e4e6ea, #9ea1a8)',
      halo: 'radial-gradient(circle, rgba(200, 220, 255, 0.25) 0%, transparent 70%)',
      border: 'rgba(255, 255, 255, 0.4)',
    },
    'space-gray': {
      name: 'Space Gray',
      desc: 'Sophisticated deep gray tones crafted with bead-blasted matte precision.',
      gradient: 'linear-gradient(145deg, #5b5d63, #36373b)',
      halo: 'radial-gradient(circle, rgba(140, 150, 170, 0.2) 0%, transparent 70%)',
      border: 'rgba(255, 255, 255, 0.25)',
    },
    'midnight': {
      name: 'Midnight',
      desc: 'Deep cosmic blue with rich obsidian undertones that shift under ambient studio light.',
      gradient: 'linear-gradient(145deg, #1d2738, #0a0e17)',
      halo: 'radial-gradient(circle, rgba(41, 151, 255, 0.25) 0%, transparent 70%)',
      border: 'rgba(41, 151, 255, 0.35)',
    }
  };

  function initColorStudio() {
    finishPillBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        audio.playClick(1000);
        finishPillBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const finishKey = btn.dataset.finish;
        const profile = finishProfiles[finishKey];
        if (!profile) return;

        if (finishModelText) finishModelText.textContent = `MacBook Pro in ${profile.name}`;
        if (finishDynamicDesc) finishDynamicDesc.textContent = profile.desc;
        if (summaryDeviceTitle) summaryDeviceTitle.textContent = `${state.config.size}-inch MacBook Pro — ${profile.name}`;

        if (finishDeviceCard) {
          finishDeviceCard.style.background = profile.gradient;
          finishDeviceCard.style.borderColor = profile.border;
        }
        if (finishHalo) {
          finishHalo.style.background = profile.halo;
        }
      });
    });

    // 3D tilt effect on device card
    if (finishDeviceCard) {
      finishDeviceCard.addEventListener('mousemove', (e) => {
        const rect = finishDeviceCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        finishDeviceCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      finishDeviceCard.addEventListener('mouseleave', () => {
        finishDeviceCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    }
  }

  // ==========================================
  // 4. M4 SILICON ARCHITECTURE & BENCHMARKS
  // ==========================================
  const benchmarkData = {
    m4: {
      title: 'M4',
      glow: 'rgba(41, 151, 255, 0.35)',
      video: { m4: '2.1x', m4Pct: 55, m1: '1.0x', m1Pct: 26, i9: '1.1x', i9Pct: 29, i9b: '0.45x', i9bPct: 12, desc: 'M4 renders dual-stream 4K and 8K ProRes timelines with zero stutter on battery or AC.' },
      '3d': { m4: '2.3x', m4Pct: 60, m1: '1.0x', m1Pct: 26, i9: '1.2x', i9Pct: 31, i9b: '0.40x', i9bPct: 10, desc: 'Hardware-accelerated ray tracing brings interactive viewport fidelity in Blender and Cinema 4D.' },
      ai: { m4: '2.8x', m4Pct: 70, m1: '1.0x', m1Pct: 25, i9: '0.9x', i9Pct: 22, i9b: '0.35x', i9bPct: 9, desc: '16-core Neural Engine generates text and executes diffusion models at lightning speeds.' },
      code: { m4: '1.9x', m4Pct: 50, m1: '1.0x', m1Pct: 26, i9: '1.1x', i9Pct: 29, i9b: '0.50x', i9bPct: 13, desc: 'Multi-threaded LLVM and Xcode builds complete in seconds.' },
    },
    m4pro: {
      title: 'M4 PRO',
      glow: 'rgba(168, 85, 247, 0.4)',
      video: { m4: '3.1x', m4Pct: 80, m1: '1.0x', m1Pct: 26, i9: '1.2x', i9Pct: 31, i9b: '0.45x', i9bPct: 12, desc: 'Up to 20-core GPU with 273GB/s memory bandwidth powers complex multi-cam 8K video suites.' },
      '3d': { m4: '3.4x', m4Pct: 85, m1: '1.0x', m1Pct: 26, i9: '1.2x', i9Pct: 31, i9b: '0.40x', i9bPct: 10, desc: 'Sub-surface scattering and complex geometry mesh shaders render near real-time.' },
      ai: { m4: '3.6x', m4Pct: 90, m1: '1.0x', m1Pct: 25, i9: '0.9x', i9Pct: 22, i9b: '0.35x', i9bPct: 9, desc: 'Execute on-device 70B parameter LLM quantization with huge memory buffers.' },
      code: { m4: '2.7x', m4Pct: 72, m1: '1.0x', m1Pct: 26, i9: '1.1x', i9Pct: 29, i9b: '0.50x', i9bPct: 13, desc: 'Massive codebases compile effortlessly across all 14 CPU cores.' },
    },
    m4max: {
      title: 'M4 MAX',
      glow: 'rgba(236, 72, 153, 0.45)',
      video: { m4: '3.8x', m4Pct: 100, m1: '1.0x', m1Pct: 26, i9: '1.2x', i9Pct: 31, i9b: '0.45x', i9bPct: 12, desc: '40 GPU cores and two ProRes encode engines tear through Hollywood-grade 8K color grades.' },
      '3d': { m4: '4.2x', m4Pct: 100, m1: '1.0x', m1Pct: 24, i9: '1.3x', i9Pct: 31, i9b: '0.40x', i9bPct: 10, desc: 'Unprecedented 546 GB/s bandwidth renders massive 3D scenes without paging.' },
      ai: { m4: '4.5x', m4Pct: 100, m1: '1.0x', m1Pct: 22, i9: '0.9x', i9Pct: 20, i9b: '0.35x', i9bPct: 8, desc: 'Run state-of-the-art multimodal AI transformers locally with 128GB unified RAM.' },
      code: { m4: '3.5x', m4Pct: 95, m1: '1.0x', m1Pct: 27, i9: '1.2x', i9Pct: 32, i9b: '0.50x', i9bPct: 14, desc: 'Top-tier 16-core CPU executes parallel unit test suites and containerized microservices.' },
    }
  };

  function updateBenchmarkUI() {
    const chipConfig = benchmarkData[state.selectedChip];
    const taskConfig = chipConfig[state.selectedTask];

    if (dieChipTitle) dieChipTitle.textContent = chipConfig.title;
    if (dieGlow) dieGlow.style.background = `radial-gradient(circle, ${chipConfig.glow} 0%, transparent 70%)`;
    
    if (barM4Label) barM4Label.textContent = `MacBook Pro (${chipConfig.title})`;
    if (barM4Val) barM4Val.textContent = taskConfig.m4;
    if (barM4Fill) barM4Fill.style.width = `${taskConfig.m4Pct}%`;

    if (barM1Val) barM1Val.textContent = `${taskConfig.m1} (Baseline)`;
    if (barM1Fill) barM1Fill.style.width = `${taskConfig.m1Pct}%`;

    if (barI9Val) barI9Val.textContent = taskConfig.i9;
    if (barI9Fill) barI9Fill.style.width = `${taskConfig.i9Pct}%`;

    if (barI9BatteryVal) barI9BatteryVal.textContent = `${taskConfig.i9b} (Throttled)`;
    if (barI9BatteryFill) barI9BatteryFill.style.width = `${taskConfig.i9bPct}%`;

    if (benchmarkDescText) benchmarkDescText.textContent = taskConfig.desc;
  }

  function initBenchmarks() {
    chipTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        audio.playClick(1100);
        chipTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedChip = btn.dataset.chip;
        updateBenchmarkUI();
      });
    });

    taskPills.forEach(pill => {
      pill.addEventListener('click', () => {
        audio.playClick(1300);
        taskPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.selectedTask = pill.dataset.task;
        updateBenchmarkUI();
      });
    });
  }

  // ==========================================
  // 5. LIQUID RETINA XDR DISPLAY SIMULATOR
  // ==========================================
  function initDisplaySimulator() {
    if (nitsSlider) {
      nitsSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (nitsVal) nitsVal.textContent = val.toLocaleString();
        
        const flareScale = 0.6 + (val / 1600) * 0.8;
        const brightness = 0.7 + (val / 1600) * 0.5;
        const contrast = 0.9 + (val / 1600) * 0.4;

        if (hdrSunFlare) {
          hdrSunFlare.style.transform = `scale(${flareScale})`;
        }
        if (displayScreenGlass) {
          displayScreenGlass.style.filter = `brightness(${brightness}) contrast(${contrast})`;
        }
      });
    }

    if (toggleMiniledBtn && miniLedGrid) {
      toggleMiniledBtn.addEventListener('click', () => {
        audio.playClick(900);
        const isActive = toggleMiniledBtn.classList.toggle('active');
        miniLedGrid.classList.toggle('active', isActive);
      });
    }

    if (toggleNanoBtn && nanoGlareOverlay) {
      toggleNanoBtn.addEventListener('click', () => {
        audio.playClick(900);
        const isNano = toggleNanoBtn.classList.toggle('active');
        // When nano-texture is ON, glare is removed (no glare)
        nanoGlareOverlay.classList.toggle('has-glare', !isNano);
      });
    }
  }

  // ==========================================
  // 6. THERMAL CANVAS & SPATIAL AUDIO
  // ==========================================
  function initThermalSimulator() {
    // Spawn initial particle field
    for (let i = 0; i < 40; i++) {
      state.thermalParticles.push({
        x: Math.random() * thermalCanvas.width,
        y: Math.random() * thermalCanvas.height,
        speed: 1 + Math.random() * 2,
        size: 2 + Math.random() * 3,
        opacity: 0.2 + Math.random() * 0.6,
      });
    }

    function renderThermals() {
      thermalCtx.clearRect(0, 0, thermalCanvas.width, thermalCanvas.height);
      const load = state.thermalLoad;
      const speedMult = 0.5 + (load / 100) * 4;

      // Determine color tone based on temperature
      let r = 41, g = 151, b = 255;
      if (load > 40) {
        const factor = (load - 40) / 60;
        r = Math.round(41 + factor * (239 - 41));
        g = Math.round(151 - factor * (151 - 68));
        b = Math.round(255 - factor * (255 - 68));
      }

      state.thermalParticles.forEach(p => {
        p.x += p.speed * speedMult;
        if (p.x > thermalCanvas.width) {
          p.x = 0;
          p.y = Math.random() * thermalCanvas.height;
        }

        thermalCtx.beginPath();
        thermalCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        thermalCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
        thermalCtx.fill();
      });

      requestAnimationFrame(renderThermals);
    }
    requestAnimationFrame(renderThermals);

    function updateThermalStats(val) {
      state.thermalLoad = val;
      const temp = Math.round(34 + (val / 100) * 48);
      const rpm = val < 25 ? 0 : Math.round(1200 + ((val - 25) / 75) * 4600);
      const noise = val < 25 ? '< 0 dB' : `${Math.round(12 + ((val - 25) / 75) * 16)} dB`;

      if (thermalTemp) thermalTemp.textContent = `${temp}°C`;
      if (thermalRpm) thermalRpm.textContent = `${rpm.toLocaleString()} RPM`;
      if (thermalNoise) thermalNoise.textContent = noise;
    }

    if (thermalLoadSlider) {
      thermalLoadSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        updateThermalStats(val);
        thermalLoadPills.forEach(p => p.classList.remove('active'));
      });
    }

    thermalLoadPills.forEach(pill => {
      pill.addEventListener('click', () => {
        audio.playClick(900);
        thermalLoadPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const load = parseInt(pill.dataset.load, 10);
        if (thermalLoadSlider) thermalLoadSlider.value = load;
        updateThermalStats(load);
      });
    });
  }

  function initSpatialAudioDemo() {
    let currentChordFreq = 440;

    chordBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        audio.playClick(1000);
        chordBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentChordFreq = parseFloat(btn.dataset.freq);
        audio.playSpatialChord(currentChordFreq);
      });
    });

    if (spatialPlayBtn && audioStage) {
      spatialPlayBtn.addEventListener('click', () => {
        audio.playSpatialChord(currentChordFreq);
        audioStage.classList.add('playing');
        setTimeout(() => {
          audioStage.classList.remove('playing');
        }, 1800);
      });
    }
  }

  // ==========================================
  // 7. MAGIC KEYBOARD & FORCE TOUCH TRACKPAD
  // ==========================================
  function initKeyboardSimulator() {
    // Backlight slider
    if (keyboardLightSlider) {
      keyboardLightSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        if (keyboardLightVal) keyboardLightVal.textContent = `${val}%`;
        const opacity = val / 100;
        keyCaps.forEach(k => {
          k.style.boxShadow = `0 3px 0 #08080a, 0 0 ${val / 8}px rgba(255, 255, 255, ${opacity * 0.3})`;
        });
      });
    }

    // Touch ID Click
    if (touchidTrigger) {
      touchidTrigger.addEventListener('click', () => {
        audio.playHapticThud();
        touchidTrigger.classList.add('scanned');
        if (touchidStatusText) touchidStatusText.textContent = 'Touch ID Authenticated ✓';
        setTimeout(() => {
          touchidTrigger.classList.remove('scanned');
          if (touchidStatusText) touchidStatusText.textContent = 'Touch ID Ready';
        }, 2000);
      });
    }

    // Playable key caps
    keyCaps.forEach(cap => {
      cap.addEventListener('mousedown', () => {
        audio.playKeyClick();
        cap.classList.add('pressed');
      });
      cap.addEventListener('mouseup', () => {
        cap.classList.remove('pressed');
      });
      cap.addEventListener('mouseleave', () => {
        cap.classList.remove('pressed');
      });
    });

    // Real keyboard typing events
    window.addEventListener('keydown', (e) => {
      // Ignore if user is inside a form input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      const key = e.key.toLowerCase();
      keyCaps.forEach(cap => {
        if (cap.dataset.key === key || (key === ' ' && cap.dataset.key === 'space')) {
          cap.classList.add('pressed');
          audio.playKeyClick();
        }
      });
    });

    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      keyCaps.forEach(cap => {
        if (cap.dataset.key === key || (key === ' ' && cap.dataset.key === 'space')) {
          cap.classList.remove('pressed');
        }
      });
    });

    // Force Touch Trackpad
    if (trackpadSim) {
      trackpadSim.addEventListener('mousedown', () => {
        audio.playHapticThud();
        trackpadSim.classList.add('force-clicked');
      });
      trackpadSim.addEventListener('mouseup', () => {
        trackpadSim.classList.remove('force-clicked');
      });
      trackpadSim.addEventListener('mouseleave', () => {
        trackpadSim.classList.remove('force-clicked');
      });
    }
  }

  // ==========================================
  // 8. PORTS & CHASSIS VISUALIZER
  // ==========================================
  function initPortsVisualizer() {
    portSockets.forEach(port => {
      port.addEventListener('mouseenter', () => {
        audio.playClick(1400);
        portSockets.forEach(p => p.classList.remove('active'));
        port.classList.add('active');
        if (portInfoText) {
          portInfoText.textContent = port.dataset.spec;
        }
      });

      port.addEventListener('click', () => {
        audio.playClick(1400);
        portSockets.forEach(p => p.classList.remove('active'));
        port.classList.add('active');
        if (portInfoText) {
          portInfoText.textContent = port.dataset.spec;
        }
      });
    });
  }

  // ==========================================
  // 9. HARDWARE CONFIGURATOR & ORDER DRAWER
  // ==========================================
  function animatePriceCounter(targetPrice) {
    if (!configTotalPrice) return;
    const startPrice = parseInt(configTotalPrice.textContent.replace(/,/g, ''), 10) || CONFIG.defaultPrice;
    const duration = 400;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startPrice + (targetPrice - startPrice) * ease);
      
      configTotalPrice.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        configTotalPrice.textContent = targetPrice.toLocaleString();
      }
    }
    requestAnimationFrame(step);

    if (configMonthlyPrice) {
      const monthly = (targetPrice / 12).toFixed(2);
      configMonthlyPrice.textContent = `or $${monthly}/mo. for 12 mo. with Apple Card`;
    }
  }

  function updateConfiguratorSummary() {
    const total = state.config.basePrice + state.config.sizePrice + state.config.chipPrice + state.config.ramPrice + state.config.storagePrice;
    animatePriceCounter(total);

    // Update labels
    if (sumDisplay) sumDisplay.textContent = `${state.config.size}" Liquid Retina XDR`;
    if (sumChip) {
      const chipNames = { m4: 'Apple M4', m4pro: 'Apple M4 Pro', m4max: 'Apple M4 Max' };
      sumChip.textContent = chipNames[state.config.chip] || 'Apple M4';
    }
    if (sumRam) sumRam.textContent = `${state.config.ram}GB Unified Memory`;
    if (sumStorage) sumStorage.textContent = `${state.config.storage.toUpperCase()} SSD Storage`;
  }

  function initConfigurator() {
    configChoiceCards.forEach(card => {
      card.addEventListener('click', () => {
        audio.playClick(1100);
        const group = card.dataset.group;
        const val = card.dataset.val;
        const price = parseInt(card.dataset.price, 10);

        // Deselect group siblings
        document.querySelectorAll(`.config-choice-card[data-group="${group}"]`).forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        if (group === 'size') {
          state.config.size = val;
          state.config.sizePrice = price;
        } else if (group === 'chip') {
          state.config.chip = val;
          state.config.chipPrice = price;
        } else if (group === 'ram') {
          state.config.ram = val;
          state.config.ramPrice = price;
        } else if (group === 'storage') {
          state.config.storage = val;
          state.config.storagePrice = price;
        }

        updateConfiguratorSummary();
      });
    });

    if (addToBagBtn && checkoutModal) {
      addToBagBtn.addEventListener('click', () => {
        audio.playHapticThud();
        const total = (state.config.basePrice + state.config.sizePrice + state.config.chipPrice + state.config.ramPrice + state.config.storagePrice).toLocaleString();
        if (modalSummaryText) {
          modalSummaryText.textContent = `${state.config.size}-inch MacBook Pro with ${sumChip.textContent}, ${sumRam.textContent}, and ${sumStorage.textContent} has been reserved.`;
        }
        if (modalTotalPrice) {
          modalTotalPrice.textContent = `$${total}.00`;
        }
        checkoutModal.classList.add('show');
      });
    }

    if (modalCloseBtn && checkoutModal) {
      modalCloseBtn.addEventListener('click', () => {
        audio.playClick(800);
        checkoutModal.classList.remove('show');
      });
    }

    if (modalConfirmBtn && checkoutModal) {
      modalConfirmBtn.addEventListener('click', () => {
        audio.playSpatialChord(528);
        modalConfirmBtn.textContent = 'Order Confirmed ✓';
        setTimeout(() => {
          checkoutModal.classList.remove('show');
          modalConfirmBtn.textContent = 'Complete Express Checkout';
        }, 1500);
      });
    }
  }

  // ==========================================
  // 10. HUD & CONTROLS BINDING
  // ==========================================
  function initHudControls() {
    if (hudPlayBtn) {
      hudPlayBtn.addEventListener('click', () => {
        audio.playClick(1000);
        state.isPlaying = !state.isPlaying;
        if (hudPlayIcon && hudPauseIcon) {
          hudPlayIcon.classList.toggle('hidden', state.isPlaying);
          hudPauseIcon.classList.toggle('hidden', !state.isPlaying);
        }
      });
    }

    if (hudScrubSlider) {
      hudScrubSlider.addEventListener('input', (e) => {
        state.isPlaying = false;
        if (hudPlayIcon && hudPauseIcon) {
          hudPlayIcon.classList.remove('hidden');
          hudPauseIcon.classList.add('hidden');
        }
        state.targetFrame = parseInt(e.target.value, 10);
      });
    }

    hudCheckpointTags.forEach(tag => {
      tag.addEventListener('click', () => {
        audio.playClick(1200);
        state.isPlaying = false;
        if (hudPlayIcon && hudPauseIcon) {
          hudPlayIcon.classList.remove('hidden');
          hudPauseIcon.classList.add('hidden');
        }
        const target = parseInt(tag.dataset.targetFrame, 10);
        state.targetFrame = target;
      });
    });

    // Sound toggle in top navigation
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        const isSoundOn = audio.toggleMute();
        soundOnIcon.classList.toggle('hidden', !isSoundOn);
        soundOffIcon.classList.toggle('hidden', isSoundOn);

        if (soundToast && soundToastText) {
          soundToastText.textContent = isSoundOn ? 'Sound FX Enabled' : 'Sound FX Muted';
          soundToast.classList.add('show');
          setTimeout(() => {
            soundToast.classList.remove('show');
          }, 1800);
        }
      });
    }

    // Smooth navigation anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          audio.playClick(1100);
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================
  async function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('scroll', updateScroll, { passive: true });

    // Initialize all modular interactive components
    initCursor();
    initColorStudio();
    initBenchmarks();
    initDisplaySimulator();
    initThermalSimulator();
    initSpatialAudioDemo();
    initKeyboardSimulator();
    initPortsVisualizer();
    initConfigurator();
    initHudControls();

    // Start render loop immediately
    requestAnimationFrame(animationLoop);

    // Preload frames
    await preloadImages();

    // Mark ready & dismiss preloader
    state.isReady = true;
    updateScroll();
    state.currentFrame = state.targetFrame;
    renderFrame(Math.round(state.currentFrame));

    if (loader) {
      loader.classList.add('loaded');
    }
  }

  // DOM Ready bootstrap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
