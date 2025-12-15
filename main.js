// The website here is just for dev reasons, and is not needed for Glass at all

import Color from './Color.js'
import Glass from './Glass.js'

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'))

const glass = new Glass(canvas)

glass.showBounds = true
// glass.showAreas = true

glass.showAreasOptions.hitCountForMaxColor = 2

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
  glass.arc(
    {
      x: 10,
      y: 0,
      radius: 1
    },
    '#000'
  )
  glass.rect(
    {
      coordinateMode: 'center',
      x: 10,
      y: 0,
      width: 10,
      height: 5,
      rotation: ((Date.now() / 1000) * 360) / 10
    },
    '#0f06'
  )
  glass.rect(
    {
      coordinateMode: 'center',
      x: 10,
      y: 0,
      width: 10,
      height: 5
    },
    '#f006'
  )
  // glass.triangle(
  //   {
  //     x: 20,
  //     y: 20,
  //     length1: 20,
  //     length2: 30,
  //     angle: 90,
  //     rotation: ((Date.now() / 1000) * 360) / 10
  //   },
  //   '#666'
  // )
  // glass.triangle(
  //   {
  //     x: 20,
  //     y: 20,
  //     length1: 20,
  //     length2: 30,
  //     angle: 90
  //   },
  //   '#f003'
  // )
})
