"use client";
import { useEffect, useRef } from "react";

export default function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0, height = 0, animId = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    let time = 0;
    const colors = ["#0066FF", "#39ff14"];

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.003;
      for (let j = 0; j < 2; j++) {
        ctx.beginPath();
        for (let i = 0; i <= width + 50; i += 50) {
          const y =
            height / 2 +
            Math.sin(i * 0.003 + time + j * 2) * (height * 0.4) +
            Math.cos(i * 0.005 - time * 1.5 + j * 0.5) * (height * 0.3);
          i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
        }
        ctx.strokeStyle = colors[j];
        ctx.lineWidth = 200;
        ctx.lineCap = "round";
        ctx.stroke();
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none mix-blend-screen"
      style={{ filter: "blur(80px)", opacity: 0.5 }}
    />
  );
}


