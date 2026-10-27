import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    const glass = new Glass(canvas)

    glass.on('beforeRender', () => {
      glass.rect({ x: 0, y: 0, width: 100, height: 100 }, '#0f03')
    })

    glass.on('afterRender', () => resolve())
  })
