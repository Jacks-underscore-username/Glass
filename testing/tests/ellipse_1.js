import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    const glass = new Glass(canvas)

    glass.on('beforeRender', () => {
      glass.ellipse({ x: 0, y: 0, radiusX: 10, radiusY: 15 }, { color: '#0f03' })
    })

    glass.on('afterRender', () => resolve())
  })
