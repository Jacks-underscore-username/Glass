import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    const glass = new Glass(canvas)

    glass.on('beforeRender', () => {
      glass.triangle(
        {
          x1: 0,
          y1: 0,
          x2: -10,
          y2: 10,
          x3: 10,
          y3: 10
        },
        '#0f03'
      )
    })

    glass.on('afterRender', () => resolve())
  })
