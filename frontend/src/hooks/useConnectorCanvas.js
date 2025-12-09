import { useEffect } from "react";

export default function useConnectorCanvas(canvasRef, nodesRef) {
  useEffect(() => {
    const redrawCanvas = () => {
  const canvas = canvasRef.current;
  const nodes = nodeRefs.current;

  if (!canvas || nodes.length < 2) return;

  const container = canvas.parentElement.getBoundingClientRect();
  canvas.width = container.width;
  canvas.height = container.height;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#b073ff";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";

  const rects = nodes.map((el) => el.getBoundingClientRect());

  for (let i = 0; i < rects.length - 1; i++) {
    const a = rects[i];
    const b = rects[i + 1];

    const x1 = a.left - container.left + a.width / 2;
    const y1 = a.top - container.top + a.height / 2;

    const x2 = b.left - container.left + b.width / 2;
    const y2 = b.top - container.top + b.height / 2;

    const midX = (x1 + x2) / 2;

    // Draw connector
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1, y1 + 60);
    ctx.lineTo(midX, y1 + 60);
    ctx.lineTo(midX, y2 - 60);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Neon glow nodes generator
    const drawGlow = (x, y) => {
      const g = ctx.createRadialGradient(x, y, 2, x, y, 18);
      g.addColorStop(0, "#e6b3ff");
      g.addColorStop(0.4, "#c973ff");
      g.addColorStop(1, "rgba(201, 115, 255, 0)");
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    };

    // Draw glowing circles at each connector point
    drawGlow(x1, y1);
    drawGlow(x2, y2);
  }
};


    redraw();
    window.addEventListener("scroll", redraw);
    window.addEventListener("resize", redraw);

    return () => {
      window.removeEventListener("scroll", redraw);
      window.removeEventListener("resize", redraw);
    };
  });
}
