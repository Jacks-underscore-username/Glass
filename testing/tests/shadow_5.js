import { Glass } from "../../Glass.js";

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ (
  canvas,
) =>
  new Promise((resolve) => {
    const glass = new Glass(canvas);

    glass.on("beforeRender", () => {
      glass.rect(
        { x: -60, y: -30, width: 50, height: 50 },
        { color: "#0f06", lineWidth: 3, shadowBlur: 10, shadowColor: "#fff" },
      );
      glass.arc(
        { x: 40, y: 0, radius: 25 },
        { color: "#f006", lineWidth: 3, shadowBlur: 10, shadowColor: "#fff" },
      );
      glass.triangle(
        { x1: -10, y1: 50, x2: -40, y2: 80, x3: 20, y3: 80 },
        { color: "#00f6", lineWidth: 3, shadowBlur: 10, shadowColor: "#fff" },
      );
    });

    glass.on("afterRender", () => resolve());
  });
