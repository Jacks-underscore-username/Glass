import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    const glass = new Glass(canvas)

    glass.showAreas = true
    glass.showAreasOptions.hitCountForMaxColor = 3

    glass.on('beforeRender', () => {
      glass.arc(
        { x: 0, y: 0, radius: 10, startAngle: (360 / 3) * 1, endAngle: (360 / 3) * (1 + 1.5) },
        { color: '#f003' }
      )
      glass.arc(
        { x: 0, y: 0, radius: 10, startAngle: (360 / 3) * 2, endAngle: (360 / 3) * (2 + 1.5) },
        { color: '#0f03' }
      )
      glass.arc(
        { x: 0, y: 0, radius: 10, startAngle: (360 / 3) * 3, endAngle: (360 / 3) * (3 + 1.5) },
        { color: '#00f3' }
      )
    })

    glass.on('afterRender', () => resolve())
  })
