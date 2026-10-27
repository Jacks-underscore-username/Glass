// The website here is just for dev reasons, and is not needed for Glass at all

import Color from './Color/Color.js'
import Glass from './Glass.js'

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'))

const glass = new Glass(canvas)

// glass.showBounds = true
// glass.showAreas = true
// glass.showAreasOptions.hitCountForMaxColor = 2
// glass.showAreasOptions.targetCells = 80000

glass.on('beforeRender', () => {
  // glass.rect(
  //   {
  //     x: 0,
  //     y: 0,
  //     width: 200,
  //     height: 200,
  //     coordinateMode: 'center'
  //   },
  //   '#999'
  // )

  glass.line({ x1: 0, y1: 0, x2: 100, y2: 100 }, { color: '#0f06', lineWidth: 5 })
})
