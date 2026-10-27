import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    const glass = new Glass(canvas)

    glass.showBounds = true

    glass.on('beforeRender', () => {
      let x = -50
      for (const base of /** @type {('bottom' | 'middle' | 'top')[]} */ (['bottom', 'middle', 'top'])) {
        x += 50
        let y = -50
        for (const align of /** @type {('left' | 'center' | 'right')[]} */ (['left', 'center', 'right'])) {
          y += 50
          glass.arc(
            {
              x,
              y,
              radius: 2
            },
            '#f00'
          )
          glass.text(
            {
              x,
              y,
              text: `${base} ${align}`,
              size: 5,
              alignment: align,
              baseline: base,
              rotation: (((x + 25) / 25 + ((y + 25) / 25) * 3) * 360) / 9
            },
            '#fff'
          )
        }
      }
    })

    glass.on('afterRender', () => resolve())
  })
