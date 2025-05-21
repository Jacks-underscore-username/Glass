// import Glass from './Glass.js'
// import Color from './Color.js'

// const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'))

// const glass = new Glass(canvas)

// glass.showBounds = true
// glass.showAreas = true

// glass.showAreasOptions.hitCountForMaxColor = 2

// const x = 0
// const y = 0
// let isDragging = false

// glass.on('beforeRender', () => {
//   glass.rect({ x: 0, y: 0, width: 250, height: 250, coordinateMode: 'center' }, { color: '#006' })
//   glass.arc(
//     { x, y, radius: 50 },
//     {
//       color: '#fff',
//       events: {
//         mouseDown: (cx, cy) => {
//           isDragging = true
//         },
//         mouseUp: (cx, cy) => {
//           isDragging = false
//         }
//       }
//     }
//   )
// })
