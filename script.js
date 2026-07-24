(function () {
  // Word reveal — bottom description
  const desc = document.getElementById("bottom-desc");
  if (desc) {
    const text = desc.textContent.trim();
    desc.textContent = "";
    text.split(" ").forEach(function (word, i) {
      const span = document.createElement("span");
      span.className = "word-reveal";
      span.textContent = word;
      span.style.animationDelay = 1.2 + i * 0.04 + "s";
      desc.appendChild(span);
    });
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Particle network
  const particleCanvas = document.getElementById("particle-canvas");
  if (particleCanvas && !reducedMotion) {
    const pCtx = particleCanvas.getContext("2d");
    const particles = [];
    const PARTICLE_COUNT = 55;
    const CONNECT_DIST = 130;
    const mouse = { x: -999, y: -999 };

    function resizeParticles() {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * particleCanvas.width,
          y: Math.random() * particleCanvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.4 + 0.6,
        });
      }
    }

    resizeParticles();
    initParticles();
    window.addEventListener("resize", function () {
      resizeParticles();
      initParticles();
    });

    window.addEventListener("mousemove", function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function drawParticles() {
      pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > particleCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > particleCanvas.height) p.vy *= -1;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 160) {
          p.x -= dx * 0.008;
          p.y -= dy * 0.008;
        }

        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        pCtx.fillStyle = "rgba(100, 210, 255, 0.55)";
        pCtx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const lx = p.x - p2.x;
          const ly = p.y - p2.y;
          const lineDist = Math.hypot(lx, ly);
          if (lineDist < CONNECT_DIST) {
            const alpha = (1 - lineDist / CONNECT_DIST) * 0.18;
            pCtx.beginPath();
            pCtx.moveTo(p.x, p.y);
            pCtx.lineTo(p2.x, p2.y);
            pCtx.strokeStyle = "rgba(100, 210, 255, " + alpha + ")";
            pCtx.lineWidth = 0.6;
            pCtx.stroke();
          }
        }
      }

      requestAnimationFrame(drawParticles);
    }

    requestAnimationFrame(drawParticles);
  }

  // Spotlight reveal
  const SPOTLIGHT_R = 260;
  const canvas = document.getElementById("reveal-canvas");
  const imgLayer = document.getElementById("reveal-img");

  if (!canvas || !imgLayer) return;

  const ctx = canvas.getContext("2d");
  const mouse = { x: -999, y: -999 };
  const smooth = { x: -999, y: -999 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function loop() {
    smooth.x += (mouse.x - smooth.x) * 0.1;
    smooth.y += (mouse.y - smooth.y) * 0.1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const grad = ctx.createRadialGradient(
      smooth.x, smooth.y, 0,
      smooth.x, smooth.y, SPOTLIGHT_R
    );
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,1)");
    grad.addColorStop(0.6, "rgba(255,255,255,0.75)");
    grad.addColorStop(0.75, "rgba(255,255,255,0.4)");
    grad.addColorStop(0.88, "rgba(255,255,255,0.12)");
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.beginPath();
    ctx.arc(smooth.x, smooth.y, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    const dataUrl = canvas.toDataURL();
    imgLayer.style.webkitMaskImage = "url(" + dataUrl + ")";
    imgLayer.style.maskImage = "url(" + dataUrl + ")";
    imgLayer.style.webkitMaskSize = "100% 100%";
    imgLayer.style.maskSize = "100% 100%";

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
