const cfg = {
  roles: [
    "Python Developer",
    "Machine Learning Developer",
    "AI Developer",
    "Software Developer",
    "Game Developer",
    "Problem Solver"
  ],
  roleSwitchInterval: 3000,
  roleFadeDuration: 350,
  revealRootMargin: "0px 0px -12% 0px",
  revealThreshold: 0.12,
  wave: {
    rows: 12,
    cols: 40,
    spacingX: null,
    spacingY: null,
    amplitude: 14,
    speed: 5.0,
    lineWidth: 1.0,
    pointRadius: 0.8,
    opacity: 0.25
  },
  cursorGlow: {
    enabled: true,
    size: 160,
    intensity: 0.22,
    fadeTime: 600
  },
  tilt: {
    maxRotate: 8,
    scale: 1.03
  }
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setupFullPageCanvas() {
  const canvas = document.createElement("canvas");
  canvas.id = "wavefield";
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    zIndex: 0,
    display: "block",
    pointerEvents: "none",
    opacity: cfg.wave.opacity
  });
  document.body.prepend(canvas);
  return canvas;
}

function Wavefield(canvas) {
  if (!canvas) return null;
  const ctx = canvas.getContext("2d", { alpha: true });
  let width = 0;
  let height = 0;
  let points = [];
  let animationId;
  let time = 0;
  let mousePos = { x: -1, y: -1 };

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    initPoints();
  }

  function initPoints() {
    points = [];
    const cols = Math.max(8, Math.round(cfg.wave.cols * (width / 1100)));
    const rows = Math.max(6, cfg.wave.rows);
    cfg.wave.spacingX = width / (cols - 1 || 1);
    cfg.wave.spacingY = height / (rows - 1 || 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cfg.wave.spacingX;
        const y = r * cfg.wave.spacingY;
        points.push({
          x,
          y,
          r,
          c,
          phase: Math.random() * Math.PI * 2,
          speed: cfg.wave.speed * (0.6 + Math.random() * 0.8),
          amp: cfg.wave.amplitude * (0.6 + Math.random() * 0.9)
        });
      }
    }
  }

  function getIndex(r, c, cols) {
    return r * cols + c;
  }

  function drawGrid() {
    ctx.clearRect(0, 0, width, height);
    if (!points.length) return;

    const firstR = points[0].r;
    const cols = points.filter(p => p.r === firstR).length;
    const rows = Math.ceil(points.length / cols);

    ctx.lineWidth = cfg.wave.lineWidth;
    ctx.globalCompositeOperation = "lighter";

    const distToMouse = Math.hypot(mousePos.x - width / 2, mousePos.y - height / 2);
    const maxDist = Math.hypot(width / 2, height / 2);
    const normalizedDist = distToMouse / maxDist;

    const waveAmplitude = cfg.wave.amplitude * (1 - normalizedDist);
    const waveSpeed = cfg.wave.speed * (1 + normalizedDist);

    for (let p of points) {
      p.ay = p.y + Math.sin(time * waveSpeed + p.phase) * waveAmplitude;
    }

    ctx.beginPath();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const a = points[getIndex(r, c, cols)];
        const b = points[getIndex(r, c + 1, cols)];
        ctx.moveTo(a.x, a.ay);
        ctx.lineTo(b.x, b.ay);
      }
    }

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows - 1; r++) {
        const a = points[getIndex(r, c, cols)];
        const b = points[getIndex(r + 1, c, cols)];
        ctx.moveTo(a.x, a.ay);
        ctx.lineTo(b.x, b.ay);
      }
    }

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "rgba(56,189,248,0.7)");
    grad.addColorStop(0.5, "rgba(37,99,235,0.75)");
    grad.addColorStop(1, "rgba(99,102,241,0.6)");
    ctx.strokeStyle = grad;
    ctx.stroke();

    ctx.beginPath();
    for (let p of points) {
      ctx.moveTo(p.x + cfg.wave.pointRadius, p.ay);
      ctx.arc(p.x, p.ay, cfg.wave.pointRadius, 0, Math.PI * 2);
    }
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  let lastTs = null;

  function step(ts) {
    if (!lastTs) lastTs = ts;
    const delta = (ts - lastTs) / 1000;
    lastTs = ts;

    time += delta;

    drawGrid();
    requestAnimationFrame(step);
  }

  function start() {
    if (!animationId) animationId = requestAnimationFrame(step);
  }

  function stop() {
    if (animationId) cancelAnimationFrame(animationId);
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("mousemove", (e) => {
    mousePos = { x: e.clientX, y: e.clientY };
  }, { passive: true });

  resize();
  start();

  return { start, stop, resize };
}

function setupRoleCycler() {
  const brand = $(".brand");
  if (!brand) return;
  let holder = brand.querySelector(".role-cycler");
  if (!holder) {
    holder = document.createElement("div");
    holder.className = "role-cycler";
    Object.assign(holder.style, {
      marginTop: "6px",
      fontSize: "0.95rem",
      color: "var(--muted, #64748b)",
      minHeight: "1.2em",
      position: "relative",
      lineHeight: "1",
      overflow: "visible"
    });
    brand.appendChild(holder);
  }

  const span = document.createElement("span");
  span.id = "role-cycle";
  span.textContent = cfg.roles[0];
  Object.assign(span.style, {
    display: "inline-block",
    transition: `opacity ${cfg.roleFadeDuration}ms ease, transform ${cfg.roleFadeDuration}ms ease`,
    opacity: "1"
  });
  holder.appendChild(span);

  let idx = 0;
  let timeoutId = null;

  function showNextRole() {
    const nextIdx = (idx + 1) % cfg.roles.length;
    span.style.opacity = "0";
    span.style.transform = "translateY(-6px)";
    timeoutId = setTimeout(() => {
      span.textContent = cfg.roles[nextIdx];
      span.style.opacity = "1";
      span.style.transform = "translateY(0)";
      idx = nextIdx;
    }, cfg.roleFadeDuration);
  }

  const interval = setInterval(showNextRole, cfg.roleSwitchInterval);
  window.addEventListener("beforeunload", () => {
    clearInterval(interval);
    if (timeoutId) clearTimeout(timeoutId);
  });
}

function setupScrollReveal() {
  const sections = $$("main.container section, .project-card, .spoken-card");
  if (!sections.length) return;
  sections.forEach((section) => {
    const options = {
      rootMargin: cfg.revealRootMargin,
      threshold: cfg.revealThreshold
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    }, options);
    observer.observe(section);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = setupFullPageCanvas();
  const wavefield = new Wavefield(canvas);
  setupRoleCycler();
  setupScrollReveal();
});
