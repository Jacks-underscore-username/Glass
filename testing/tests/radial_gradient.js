import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    const glass = new Glass(canvas)

    glass.on('beforeRender', () => {
      const grad = glass.createRadialGradient(0, 0, 25, 10, 10, 50)
      grad.addColorStop(0, '#f00')
      grad.addColorStop(0.5, '#0f0')
      grad.addColorStop(1, '#00f')
      glass.rect({ x: 0, y: 0, width: 100, height: 100, coordinateMode: 'center' }, { color: grad })
    })

    glass.on('afterRender', () => resolve())
  })
