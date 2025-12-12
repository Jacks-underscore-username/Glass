import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    const glass = new Glass(canvas)

    glass.on('beforeRender', () => {
      glass.triangle(
        {
          x: 0,
          y: 0,
          length1: 3,
          angle: 90,
          length2: 2
        },
        {
          color: '#0f03'
        }
      )
    })

    glass.on('afterRender', () => resolve())
  })
