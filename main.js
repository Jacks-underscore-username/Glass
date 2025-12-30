// The website here is just for dev reasons, and is not needed for Glass at all

import Color from './Color/Color.js'
import Glass from './Glass.js'

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'))

const glass = new Glass(canvas)

glass.showBounds = true
// glass.showAreas = true
// glass.showAreasOptions.hitCountForMaxColor = 3

glass.on('beforeRender', () => {
  glass.rect(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      coordinateMode: 'center'
    },
    '#999'
  )

  glass.line(
    {
      x1: 0,
      y1: 0,
      x2: Math.cos(((((Date.now() / 1000) * 360) / 10) * Math.PI) / 180) * 25,
      y2: Math.sin(((((Date.now() / 1000) * 360) / 10) * Math.PI) / 180) * 25
    },
    { color: '#0f0', lineWidth: 5, lineCap: 'round' }
  )
})
