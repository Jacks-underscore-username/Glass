import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    const glass = new Glass(canvas)

    glass.showAreas = true
    glass.showAreasOptions.hitCountForMaxColor = 3

    glass.on('beforeRender', () => {
      glass.ellipse(
        { x: 0, y: 0, radiusX: 10, radiusY: 15, startAngle: (360 / 3) * 1, endAngle: (360 / 3) * (1 + 1.5) },
        '#f003'
      )
      glass.ellipse(
        { x: 0, y: 0, radiusX: 10, radiusY: 15, startAngle: (360 / 3) * 2, endAngle: (360 / 3) * (2 + 1.5) },
        '#0f03'
      )
      glass.ellipse(
        { x: 0, y: 0, radiusX: 10, radiusY: 15, startAngle: (360 / 3) * 3, endAngle: (360 / 3) * (3 + 1.5) },
        '#00f3'
      )
    })

    glass.on('afterRender', () => resolve())
  })
