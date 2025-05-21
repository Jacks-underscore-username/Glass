;(async () => {
  /** @type {(canvas: HTMLCanvasElement)=>Promise<void>}  */
  // @ts-expect-error
  const script = (await import('./test.js')).default
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'))
  await Promise.any([script(canvas), new Promise(r => setTimeout(r, 1000))])
  await fetch('/result', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/text'
    },
    body: canvas.toDataURL('image/png')
  })
})()
