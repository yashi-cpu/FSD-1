import React, { useEffect, useRef } from 'react';

export default function CanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = 0;
    let height = 0;
    let mouseX = 0;
    let mouseY = 0;

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initialize particles
    const count = window.innerWidth < 700 ? 500 : 1000;
    const particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: Math.pow(Math.random(), 0.55),
        speed: 0.0008 + Math.random() * 0.0018,
        size: 0.3 + Math.random() * 1.5,
        alpha: 0.1 + Math.random() * 0.8,
        offset: Math.random() * Math.PI * 2
      });
    }

    function drawRings(x, y, radius, time) {
      for (let i = 0; i < 4; i++) {
        const rotation = time * 0.00015 * (i % 2 === 0 ? 1 : -1);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(1, 0.45 + i * 0.035);
        ctx.beginPath();
        ctx.arc(0, 0, radius * (0.48 + i * 0.13), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(80,255,120,${0.035 + i * 0.012})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
    }

    function drawCore(x, y, radius, time) {
      const pulse = Math.sin(time * 0.002) * 5;
      const coreRadius = radius * 0.24 + pulse;

      const core = ctx.createRadialGradient(
        x - coreRadius * 0.25,
        y - coreRadius * 0.3,
        0,
        x,
        y,
        coreRadius
      );

      core.addColorStop(0, "rgba(190,255,200,.85)");
      core.addColorStop(0.12, "rgba(80,255,120,.55)");
      core.addColorStop(0.38, "rgba(20,180,60,.18)");
      core.addColorStop(1, "rgba(0,40,15,0)");

      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(x, y, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // Core orbits
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(time * 0.0003 * (i + 1));
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          radius * (0.25 + i * 0.055),
          radius * (0.08 + i * 0.018),
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `rgba(100,255,130,${0.16 - i * 0.035})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.51 + mouseX * 18;
      const centerY = height * 0.47 + mouseY * 12;
      const maxRadius = Math.min(width, height) * 0.31;

      // Central Glow
      const glow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        maxRadius
      );
      glow.addColorStop(0, "rgba(60,255,110,.20)");
      glow.addColorStop(0.25, "rgba(30,220,80,.10)");
      glow.addColorStop(0.6, "rgba(10,100,40,.035)");
      glow.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.fill();

      const time = Date.now();

      // Particles
      particles.forEach((p) => {
        p.angle += p.speed;
        const wobble = Math.sin(time * 0.0004 + p.offset) * 3;
        const x = centerX + Math.cos(p.angle) * (p.radius * maxRadius + wobble);
        const y = centerY + Math.sin(p.angle) * (p.radius * maxRadius * 0.62 + wobble);
        const depth = Math.sin(p.angle) * 0.5 + 0.5;
        const alpha = p.alpha * (0.25 + depth * 0.8);

        ctx.beginPath();
        ctx.arc(x, y, p.size * (0.5 + depth), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(105,255,135,${alpha})`;
        ctx.fill();
      });

      drawRings(centerX, centerY, maxRadius, time);
      drawCore(centerX, centerY, maxRadius, time);

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} id="canvas" className="w-full h-full" />;
}

