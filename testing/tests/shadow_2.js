import { Glass } from "../../Glass.js";

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ (
  canvas,
) =>
  new Promise((resolve) => {
    const glass = new Glass(canvas);

    glass.on("beforeRender", () => {
      glass.arc(
        { x: 0, y: 0, radius: 30 },
        { color: "#0f03", shadowBlur: 15, shadowColor: "#fff" },
      );
    });

    glass.on("afterRender", () => resolve());
  });
