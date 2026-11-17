// The website here is just for dev reasons, and is not needed for Glass at all

import Color from "./Color/Color.js";
import { Glass, createSpriteRect } from "./Glass.js";

const canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById("canvas")
);

const glass = new Glass(canvas);

// glass.showBounds = true
// glass.showAreas = true
// glass.showAreasOptions.hitCountForMaxColor = 2
// glass.showAreasOptions.targetCells = 80000
createSpriteRect(
  {
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    coordinateMode: "center",
  },
  "#999",
  {
    glass,
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
  },
);
const b = createSpriteRect(
  {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    coordinateMode: "center",
  },
  {
    color: "#0f0",
    onClick() {
      console.log(this);
    },
  },
  {
    glass,
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
  },
);

glass.on("beforeRender", () => {
  b.rotation += 1;
  console.log(b);
});
