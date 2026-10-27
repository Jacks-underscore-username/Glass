import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    const glass = new Glass(canvas)

    glass.on('beforeRender', () => {
      glass.rect(
        { x: -80, y: 0, width: 40, height: 40, coordinateMode: 'center' },
        { color: '#fff3', shadowBlur: 12, shadowColor: '#f00' }
      )
      glass.rect(
        { x: 0, y: 0, width: 40, height: 40, coordinateMode: 'center' },
        { color: '#fff3', shadowBlur: 12, shadowColor: '#0f0' }
      )
      glass.rect(
        { x: 80, y: 0, width: 40, height: 40, coordinateMode: 'center' },
        { color: '#fff3', shadowBlur: 12, shadowColor: '#00f' }
      )
    })

    glass.on('afterRender', () => resolve())
  })
