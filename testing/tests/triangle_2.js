import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    const glass = new Glass(canvas)

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
    })

    glass.on('afterRender', () => resolve())
  })
