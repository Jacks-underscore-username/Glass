// The website here is just for dev reasons, and is not needed for Glass at all

import Color from "./Color/Color.js";
import { Glass } from "./Glass.js";

const canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById("canvas")
);

const glass = new Glass(canvas);

//glass.showBounds = true;
//glass.showAreas = true;
//glass.showAreasOptions.hitCountForMaxColor = 2;

const rectSprite = glass.createSprite(
  glass.rect,
  { x: 0, y: 0, width: 100, height: 100, coordinateMode: "center" },
  {
    onClick: () => {
      rectSprite.shapeDefinition.rotation = 0;
    },
    color: "#0f0",
    layer: -1,
  },
);

const arcSprite = glass.createSprite(
  glass.arc,
  { x: 0, y: 0, radius: 10 },
  {
    color: "#fff",
    onClick: () => {
      arcSprite.shapeDefinition.radius = 10;
    },
    layer: 1,
  },
);

glass.on("beforeRender", () => {
  if (rectSprite.shapeDefinition.rotation === undefined)
    rectSprite.shapeDefinition.rotation = 0;
  else rectSprite.shapeDefinition.rotation++;
  if (rectSprite.shapeDefinition.rotation >= 90) {
    console.log(rectSprite.options);
    if (typeof rectSprite.options.color !== "string")
      return rectSprite.remove();
    const color = Color.fromHex(rectSprite.options.color);
    color.hue += 50;
    rectSprite.options.color = color.hex;
    rectSprite.shapeDefinition.rotation = 0;
    arcSprite.shapeDefinition.radius += 5;
  }
});
