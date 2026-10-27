import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    const glass = new Glass(canvas)

    glass.on('beforeRender', () => {
      glass.line({ x1: 0, y1: 0, x2: 100, y2: 100 }, { color: '#0f06', lineWidth: 5 })
    })

    glass.on('afterRender', () => resolve())
  })
