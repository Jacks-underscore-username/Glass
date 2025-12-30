import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    const glass = new Glass(canvas)

    glass.showBounds = true

    glass.on('beforeRender', () => {
      for (let i = 0; i < 3; i++) {
        const lineCap = /** @type {CanvasRenderingContext2D['lineCap'][]} */ (['butt', 'round', 'square'])[i]
        glass.line(
          {
            x1: Math.cos(((Math.PI * 2) / 3) * i) * -25,
            y1: Math.sin(((Math.PI * 2) / 3) * i) * -25,
            x2: Math.cos(((Math.PI * 2) / 3) * i) * 25,
            y2: Math.sin(((Math.PI * 2) / 3) * i) * 25
          },
          { color: ['#f003', '#0f03', '#00f3'][i], lineWidth: 5, lineCap }
        )
      }
    })

    glass.on('afterRender', () => resolve())
  })
