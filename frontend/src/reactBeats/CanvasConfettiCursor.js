import React, { useEffect, useRef } from "react";

class Particle {
  constructor(x, y, size, color, speedX, speedY, decay, overlayOpacity) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
    this.decay = decay;
    this.overlayOpacity = overlayOpacity;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.size *= this.decay;
  }

  draw(ctx) {
    ctx.globalAlpha = this.overlayOpacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export const CanvasConfettiCursor = ({
    containerRef,
//   fillParent = false,
  colors = ["#9D00FF"],
  minSize = 2,
  maxSize = 7,
  particleCount = 40,
  frequency = 50,
  fillParent = false,
  overlayOpacity = 1,
  decay = 0.98,
  onExplosion,
  enabled = true,
  style,
  className,
}) => {
    const internalParentRef = useRef(null);
  const parentRef = containerRef || internalParentRef
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const particles = useRef([]);
  const lastSpawn = useRef(0);

  // Resize canvas
  const resizeCanvas = () => {
    if (!canvasRef.current) return;
    const c = canvasRef.current;
    if (fillParent && parentRef.current) {
      c.width = parentRef.current.offsetWidth;
      c.height = parentRef.current.offsetHeight;
    } else {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    }
  };

  useEffect(() => {
    resizeCanvas();
    if (!fillParent) {
      window.addEventListener("resize", resizeCanvas);
      return () => window.removeEventListener("resize", resizeCanvas);
    }
  }, [fillParent]);

  // Mouse/touch move handler
  useEffect(() => {
    if (!enabled) return;
    const handler = (e) => {
      let x = 0, y = 0;
      if ("touches" in e && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else if ("clientX" in e) {
        x = e.clientX;
        y = e.clientY;
      }
      if (fillParent && parentRef.current) {
        const rect = parentRef.current.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;
      }
      mousePos.current = { x, y };
    };
    const target = fillParent && parentRef.current ? parentRef.current : window;
    target.addEventListener("mousemove", handler);
    target.addEventListener("touchmove", handler);
    return () => {
      target.removeEventListener("mousemove", handler);
      target.removeEventListener("touchmove", handler);
    };
  }, [fillParent, enabled]);

  // Animation loop
  useEffect(() => {
    if (!enabled) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;

    const loop = (time) => {
      ctx.clearRect(0, 0, canvasRef.current?.width, canvasRef.current?.height);

      // Spawn particles on schedule
      if (time - lastSpawn.current > frequency) {
        for (let i = 0; i < particleCount; i++) {
          const size = Math.random() * (maxSize - minSize) + minSize;
          const color = colors[Math.floor(Math.random() * colors.length)];
          const speedX = (Math.random() * 2 - 1) * 2;
          const speedY = (Math.random() * 2 - 1) * 2;
          particles.current.push(
            new Particle(
              mousePos.current.x,
              mousePos.current.y,
              size,
              color,
              speedX,
              speedY,
              decay,
              overlayOpacity
            )
          );
        }
        if (onExplosion) onExplosion(mousePos.current.x, mousePos.current.y);
        lastSpawn.current = time;
      }

      // Update and draw
      particles.current = particles.current.filter((p) => {
        p.update();
        p.draw(ctx);
        return p.size > 0.5;
      });

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }, [
    enabled,
    colors,
    minSize,
    maxSize,
    particleCount,
    frequency,
    decay,
    overlayOpacity,
    onExplosion,
  ]);

  if (!enabled) return null;

  return (
    <div
      ref={parentRef}
      style={
        fillParent
          ? { position: "relative", width: "100%", height: "100%" }
          : { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50 }
      }
    >
      <canvas
        ref={canvasRef}
        style={{
          position: fillParent ? "absolute" : "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "transparent",
          ...style,
        }}
        className={className}
      />
    </div>
  );
};
