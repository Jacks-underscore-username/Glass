import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    const glass = new Glass(canvas)

    glass.showBounds = true
    glass.showAreas = true
    glass.showAreasOptions.hitCountForMaxColor = 3

    glass.on('beforeRender', () => {
      for (let i = 0; i < 3; i++) {
        const radians = (i / 3) * Math.PI * 2 + ((360 / 4) * Math.PI) / 180

        const x = Math.cos(radians) * 10
        const y = Math.sin(radians) * 10
        glass.triangle(
          {
            x1: x,
            y1: y,
            x2: x - 10,
            y2: y - 10,
            x3: x + 10,
            y3: y - 10,
            rotation: (i * 360) / 3
          },
          {
            color: ['#f003', '#0f03', '#00f3'][i]
          }
        )
      }
    })

    glass.on('afterRender', () => resolve())
  })
