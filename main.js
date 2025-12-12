import Color from './Color.js'
import Glass from './Glass.js'

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'))

const glass = new Glass(canvas)

// glass.showBounds = true
// glass.showAreas = true

glass.showAreasOptions.hitCountForMaxColor = 2

glass.on('beforeRender', () => {
  for (let i = 0; i < 3; i++) {
    const radians = (i / 3) * Math.PI * 2 + ((360 / 4) * Math.PI) / 180

    const x = Math.cos(radians) * 20
    const y = Math.sin(radians) * 20
    glass.triangle(
      {
        x,
        y,
        length1: 30,
        angle: 90,
        length2: 30,
        rotation: (i * 360) / 3 + (360 / 8) * 7
      },
      {
        color: ['#f003', '#0f03', '#00f3'][i]
      }
    )
  }
  // glass.rect(
  //   {
  //     x: 0,
  //     y: 0,
  //     width: 100,
  //     height: 100,
  //     coordinateMode: 'center'
  //   },
  //   { color: '#999' }
  // )
  // glass.triangle(
  //   {
  //     x: 20,
  //     y: 20,
  //     length1: 20,
  //     length2: 30,
  //     angle: 90,
  //     rotation: ((Date.now() / 1000) * 360) / 10
  //   },
  //   { color: '#666' }
  // )
  // glass.triangle(
  //   {
  //     x: 20,
  //     y: 20,
  //     length1: 20,
  //     length2: 30,
  //     angle: 90
  //   },
  //   { color: '#f003' }
  // )
})
