// Birthday Greeting Interactive Script
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const audioGiangHo = document.getElementById('audioGiangHo');
  const audioPhanDinhTung = document.getElementById('audioPhanDinhTung');
  const bankForm = document.getElementById('bankForm');
  const submitGiftBtn = document.getElementById('submitGiftBtn');
  const trollModal = document.getElementById('trollModal');
  const closeTrollBtn = document.getElementById('closeTrollBtn');
  const cardViewport = document.getElementById('cardViewport');

  // Slides
  const slides = document.querySelectorAll('.photo-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentSlide = 0;
  let slideInterval = null;

  // 1. Direct Entry & Audio Autoplay (No Intro Click Required)
  audioGiangHo.volume = 1.0;
  audioPhanDinhTung.volume = 0.65;

  function tryPlayAudio() {
    const p1 = audioGiangHo.play();
    const p2 = audioPhanDinhTung.play();

    if (p1 !== undefined) {
      p1.catch(() => {
        // Fallback for strict browser autoplay: start on first user interaction anywhere
        const enableAudioOnGesture = () => {
          audioGiangHo.play();
          audioPhanDinhTung.play();
          window.removeEventListener('pointerdown', enableAudioOnGesture);
          window.removeEventListener('keydown', enableAudioOnGesture);
          window.removeEventListener('touchstart', enableAudioOnGesture);
        };
        window.addEventListener('pointerdown', enableAudioOnGesture, { once: true });
        window.addEventListener('keydown', enableAudioOnGesture, { once: true });
        window.addEventListener('touchstart', enableAudioOnGesture, { once: true });
      });
    }
    if (p2 !== undefined) {
      p2.catch(() => {});
    }
  }

  // Attempt autoplay immediately
  tryPlayAudio();
  window.addEventListener('load', tryPlayAudio);

  // 2. Photo Slideshow
  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    let prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  function startSlideshow() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 4500);
  }
  startSlideshow();

  nextBtn.addEventListener('click', () => {
    nextSlide();
    startSlideshow();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    startSlideshow();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.slide);
      showSlide(idx);
      startSlideshow();
    });
  });

  // Touch Swipe for Mobile
  const slidesContainer = document.getElementById('slidesContainer');
  let touchStartX = 0;
  let touchEndX = 0;

  slidesContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slidesContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 40) {
      nextSlide();
      startSlideshow();
    } else if (touchEndX - touchStartX > 40) {
      prevSlide();
      startSlideshow();
    }
  }, { passive: true });

  // 3. Canvas 1: Background Kaleidoscope, Disco Lights & Confetti
  const bgCanvas = document.getElementById('bgCanvas');
  const bgCtx = bgCanvas.getContext('2d');
  let bgW = 0;
  let bgH = 0;

  function resizeBgCanvas() {
    bgW = bgCanvas.width = window.innerWidth;
    bgH = bgCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeBgCanvas);
  resizeBgCanvas();

  // Confetti Particles
  const confettiList = [];
  const confettiColors = ['#ff007f', '#00f3ff', '#ffd700', '#9d00ff', '#ff3366', '#00ffaa', '#ffffff'];

  for (let i = 0; i < 75; i++) {
    confettiList.push({
      x: Math.random() * bgW,
      y: Math.random() * bgH,
      size: Math.random() * 8 + 4,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speedY: Math.random() * 2 + 1.2,
      speedX: Math.random() * 1.5 - 0.75,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 4 - 2,
      oscillation: Math.random() * 50
    });
  }

  let bgAngle = 0;
  function renderBackground() {
    bgCtx.clearRect(0, 0, bgW, bgH);
    bgAngle += 0.008;

    // Disco light rays
    const cx = bgW / 2;
    const cy = bgH / 2;
    const rays = 12;
    bgCtx.save();
    bgCtx.translate(cx, cy);

    for (let i = 0; i < rays; i++) {
      const angle = (Math.PI * 2 / rays) * i + bgAngle;
      const gradient = bgCtx.createRadialGradient(0, 0, 10, 0, 0, Math.max(bgW, bgH) * 0.7);
      const col = i % 2 === 0 ? 'rgba(255, 0, 127, 0.12)' : 'rgba(0, 243, 255, 0.09)';
      gradient.addColorStop(0, col);
      gradient.addColorStop(0.6, 'rgba(157, 0, 255, 0.05)');
      gradient.addColorStop(1, 'transparent');

      bgCtx.fillStyle = gradient;
      bgCtx.beginPath();
      bgCtx.moveTo(0, 0);
      bgCtx.arc(0, 0, Math.max(bgW, bgH) * 0.8, angle - 0.12, angle + 0.12);
      bgCtx.closePath();
      bgCtx.fill();
    }
    bgCtx.restore();

    // Render Confetti
    for (let p of confettiList) {
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.y * 0.02) * 0.6;
      p.rotation += p.rotSpeed;

      if (p.y > bgH + 20) {
        p.y = -20;
        p.x = Math.random() * bgW;
      }

      bgCtx.save();
      bgCtx.translate(p.x, p.y);
      bgCtx.rotate((p.rotation * Math.PI) / 180);
      bgCtx.fillStyle = p.color;
      bgCtx.shadowBlur = 6;
      bgCtx.shadowColor = p.color;
      bgCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      bgCtx.restore();
    }

    requestAnimationFrame(renderBackground);
  }
  renderBackground();

  // 4. Canvas 2: "Hình Trái Tim & Bông Hoa Chạy Xung Quanh" (Orbiting & Moving Around)
  const fxCanvas = document.getElementById('fxCanvas');
  const fxCtx = fxCanvas.getContext('2d');
  let fxW = 0;
  let fxH = 0;

  function resizeFxCanvas() {
    fxW = fxCanvas.width = cardViewport.offsetWidth;
    fxH = fxCanvas.height = cardViewport.offsetHeight;
  }
  window.addEventListener('resize', resizeFxCanvas);
  resizeFxCanvas();

  // Stardust trail from the moving hearts
  const trailParticles = [];

  // Orbiting Heart Object Class
  class OrbitingHeart {
    constructor(radiusXFactor, radiusYFactor, speed, initialAngle, colorTheme) {
      this.rxFactor = radiusXFactor;
      this.ryFactor = radiusYFactor;
      this.speed = speed;
      this.angle = initialAngle;
      this.colorTheme = colorTheme; // 'pink' or 'gold'
      this.heartScale = 0.8;
      this.particles = [];
      this.initHeartShape();
    }

    initHeartShape() {
      const count = 48;
      for (let i = 0; i < count; i++) {
        const t = (Math.PI * 2 / count) * i;
        // Standard Parametric Heart Curve
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        this.particles.push({
          relX: hx * 2.2,
          relY: hy * 2.2,
          size: Math.random() * 2.5 + 2,
          sparkleRate: Math.random() * 0.15 + 0.08
        });
      }
    }

    update() {
      this.angle += this.speed;

      // Orbit around the photo stage borders so it DOES NOT block the face
      const cx = fxW * 0.5;
      const cy = fxH * 0.38;
      const rx = fxW * this.rxFactor;
      const ry = fxH * this.ryFactor;

      this.currentX = cx + Math.cos(this.angle) * rx;
      this.currentY = cy + Math.sin(this.angle) * ry;

      // Emit stardust trail behind moving heart
      if (Math.random() < 0.6) {
        trailParticles.push({
          x: this.currentX + (Math.random() - 0.5) * 16,
          y: this.currentY + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 1,
          vy: Math.random() * 1 + 0.5,
          size: Math.random() * 3 + 1.5,
          color: this.colorTheme === 'pink' ? '#ff69b4' : '#ffd700',
          life: 0,
          maxLife: 45
        });
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.currentX, this.currentY);

      // Subtle gentle aura (no blinding center glow)
      const aura = ctx.createRadialGradient(0, 0, 0, 0, 0, 28);
      const auraCol = this.colorTheme === 'pink' ? 'rgba(255, 105, 180, 0.4)' : 'rgba(255, 215, 0, 0.4)';
      aura.addColorStop(0, auraCol);
      aura.addColorStop(1, 'transparent');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing heart scale
      const pulse = 1 + Math.sin(this.angle * 3) * 0.12;

      // Draw Sparkling Heart Outline
      for (let p of this.particles) {
        const px = p.relX * pulse;
        const py = p.relY * pulse;
        const twinkle = Math.sin(this.angle * 4 + p.sparkleRate * 10) * 0.35 + 0.65;

        ctx.fillStyle = this.colorTheme === 'pink' 
          ? (Math.random() > 0.3 ? '#ff9ee2' : '#ffffff')
          : (Math.random() > 0.3 ? '#ffd700' : '#ffffff');
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.colorTheme === 'pink' ? '#ff007f' : '#ffd700';

        ctx.beginPath();
        ctx.arc(px, py, p.size * twinkle, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // 2 hearts orbiting smoothly around the photo stage borders:
  // Heart 1: Neon Pink / Magenta heart
  const heart1 = new OrbitingHeart(0.40, 0.24, 0.022, 0, 'pink');
  // Heart 2: Sparkling Golden heart running on opposite side
  const heart2 = new OrbitingHeart(0.38, 0.22, -0.018, Math.PI, 'gold');

  // Custom click bursts
  const clickBursts = [];
  function spawnClickBurst(x, y) {
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 / 30) * i;
      const speed = Math.random() * 3 + 1.5;
      clickBursts.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: i % 2 === 0 ? '#ffd700' : '#ff007f',
        life: 0,
        maxLife: 35
      });
    }
  }

  cardViewport.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    const rect = cardViewport.getBoundingClientRect();
    spawnClickBurst(e.clientX - rect.left, e.clientY - rect.top);
  });

  // Render Loop for Effects Canvas
  function renderFx() {
    fxCtx.clearRect(0, 0, fxW, fxH);

    // Update & draw orbiting hearts
    heart1.update();
    heart1.draw(fxCtx);

    heart2.update();
    heart2.draw(fxCtx);

    // Update & draw stardust trail
    for (let i = trailParticles.length - 1; i >= 0; i--) {
      const p = trailParticles[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      const alpha = 1 - (p.life / p.maxLife);

      if (alpha <= 0) {
        trailParticles.splice(i, 1);
        continue;
      }

      fxCtx.save();
      fxCtx.fillStyle = p.color;
      fxCtx.globalAlpha = alpha;
      fxCtx.shadowBlur = 6;
      fxCtx.shadowColor = p.color;
      fxCtx.beginPath();
      fxCtx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      fxCtx.fill();
      fxCtx.restore();
    }

    // Update & draw click bursts
    for (let i = clickBursts.length - 1; i >= 0; i--) {
      const p = clickBursts[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      const alpha = 1 - (p.life / p.maxLife);

      if (alpha <= 0) {
        clickBursts.splice(i, 1);
        continue;
      }

      fxCtx.save();
      fxCtx.fillStyle = p.color;
      fxCtx.globalAlpha = alpha;
      fxCtx.shadowBlur = 8;
      fxCtx.shadowColor = p.color;
      fxCtx.beginPath();
      fxCtx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      fxCtx.fill();
      fxCtx.restore();
    }

    requestAnimationFrame(renderFx);
  }
  renderFx();

  // 5. Bank Gift Submission & Troll Dialog ("CÓ CC NÈ 8==D")
  function playTrollSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Funny comedic buzzer slide
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.35);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.55);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.9);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.95);
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  }

  function triggerGiantConfettiBurst() {
    for (let i = 0; i < 60; i++) {
      confettiList.push({
        x: Math.random() * bgW,
        y: -10,
        size: Math.random() * 12 + 6,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        speedY: Math.random() * 5 + 3,
        speedX: Math.random() * 4 - 2,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 8 - 4,
        oscillation: Math.random() * 50
      });
    }
  }

  submitGiftBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const bankName = document.getElementById('bankName').value.trim();
    const accountNumber = document.getElementById('accountNumber').value.trim();

    // Show Troll Modal with exact text "CÓ CC NÈ 8==D"
    trollModal.classList.add('show');
    playTrollSound();
    triggerGiantConfettiBurst();

    // Also trigger standard dialog if required
    setTimeout(() => {
      alert("CÓ CC NÈ 8==D");
    }, 200);
  });

  closeTrollBtn.addEventListener('click', () => {
    trollModal.classList.remove('show');
  });

  trollModal.addEventListener('click', (e) => {
    if (e.target === trollModal) {
      trollModal.classList.remove('show');
    }
  });
});
