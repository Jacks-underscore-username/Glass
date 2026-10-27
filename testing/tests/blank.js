import Glass from '../../Glass.js'

export default /** @param {HTMLCanvasElement} canvas; @returns {Promise<void>} */ canvas =>
  new Promise(resolve => {
    // @ts-expect-error
    const _glass = new Glass(canvas)
    resolve()
  })
