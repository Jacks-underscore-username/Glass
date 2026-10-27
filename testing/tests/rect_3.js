import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    const glass = new Glass(canvas)

    glass.on('beforeRender', () => {
      glass.rect({ x: 0, y: 0, width: 100, height: 50, rotation: 15 * 1, coordinateMode: 'center' }, '#f003')
      glass.rect({ x: 0, y: 0, width: 100, height: 50, rotation: 15 * 2, coordinateMode: 'corner' }, '#0f03')
      glass.rect({ x: 0, y: 0, width: 100, height: 50, rotation: 15 * 3 }, '#00f3')
    })

    glass.on('afterRender', () => resolve())
  })
