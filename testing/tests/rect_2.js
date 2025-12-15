import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    const glass = new Glass(canvas)

    glass.on('beforeRender', () => {
      glass.rect({ x: 75, y: 0, width: 100, height: 50 }, '#f003')
      glass.rect({ x: 0, y: 0, width: 100, height: 50 }, '#0f03')
      glass.rect({ x: -75, y: 0, width: 100, height: 50 }, '#00f3')
    })

    glass.on('afterRender', () => resolve())
  })
