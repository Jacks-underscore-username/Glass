import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    const glass = new Glass(canvas)

    glass.on('beforeRender', () => {
      glass.rect({ x: -60, y: -30, width: 50, height: 50 }, { color: '#f003', shadowBlur: 10, shadowColor: '#f00' })
      glass.arc({ x: 40, y: 0, radius: 25 }, { color: '#0f03', shadowBlur: 10, shadowColor: '#0f0' })
      glass.ellipse(
        { x: -10, y: 30, radiusX: 30, radiusY: 15 },
        { color: '#00f3', shadowBlur: 10, shadowColor: '#00f' }
      )
    })

    glass.on('afterRender', () => resolve())
  })
