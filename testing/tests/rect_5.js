import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    const glass = new Glass(canvas)

    glass.showAreas = true
    glass.showAreasOptions.hitCountForMaxColor = 3

    glass.on('beforeRender', () => {
      glass.rect({ x: 0, y: 0, width: 100, height: 50, rotation: 15 * 1, coordinateMode: 'center' }, { color: '#f003' })
      glass.rect({ x: 0, y: 0, width: 100, height: 50, rotation: 15 * 2, coordinateMode: 'corner' }, { color: '#0f03' })
      glass.rect({ x: 0, y: 0, width: 100, height: 50, rotation: 15 * 3 }, { color: '#00f3' })
    })

    glass.on('afterRender', () => resolve())
  })
