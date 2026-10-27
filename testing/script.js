;(async () => {
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'))
  const error = await new Promise(async resolve => {
    setTimeout(() => resolve('Timeout exceeded'), 1000)
    try {
      /** @type {(canvas: HTMLCanvasElement)=>Promise<void>}  */
      // @ts-expect-error
      const script = (await import('./test.js')).default
      await script(canvas)
      resolve('')
    } catch (error) {
      resolve(`Test threw error: ${error}`)
    }
  })
  if (error) console.error(error)
  await fetch('/result', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/text'
    },
    body: canvas.toDataURL('image/png')
  })
})()
