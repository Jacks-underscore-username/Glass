import Color from 'basic-color'

/**
 * @typedef {object} GlassEntryBase
 *
 * @property {(scale:number)=>any} scale
 * @property {(x:number,y:number)=>any} shift
 * @property {(ctx:CanvasRenderingContext2D)=>any} render
 *
 * @property {{minX:number,minY:number,maxX:number,maxY:number}} bounds
 *
 * @property {string | GlassColorGradient | CanvasGradient} color
 * @property {number} lineWidth
 * @property {number} [shadowBlur]
 * @property {string} [shadowColor]
 * @property {number} [shadowOffsetX]
 * @property {number} [shadowOffsetY]
 * @property {boolean} [static]
 * @property {number} [layer]
 *
 * @property {any[]} tags
 * @property {number} x
 * @property {number} y
 * @property {number} rotation
 *
 *
 * @typedef {object} GlassEntryBaseMouse
 * @property {'ignore'|'passthrough'|'consume'} mouseMode
 * @property {function} hasPoint
 * @property {function} [onClick]
 *
 *
 * @typedef {object} GlassEntryRectArgs
 * @property {'rect'} type
 * @property {number} width
 * @property {number} height
 * @property {'corner' | 'center'} coordinateMode
 *
 *
 * @typedef {GlassEntryBase & GlassEntryBaseMouse & GlassEntryRectArgs} GlassEntryRect
 *
 *
 * @typedef {object} GlassEntryArcArgs
 * @property {'arc'} type
 * @property {number} radius
 * @property {number} startAngle
 * @property {number} endAngle
 *
 *
 * @typedef {GlassEntryBase & GlassEntryBaseMouse & GlassEntryArcArgs} GlassEntryArc
 *
 *
 * @typedef {object} GlassEntryEllipseArgs
 * @property {'ellipse'} type
 * @property {number} radiusX
 * @property {number} radiusY
 * @property {number} startAngle
 * @property {number} endAngle
 *
 *
 * @typedef {GlassEntryBase & GlassEntryBaseMouse & GlassEntryEllipseArgs} GlassEntryEllipse
 *
 *
 * @typedef {object} GlassEntryTextArgs
 * @property {'text'} type
 * @property {'ignore'} mouseMode
 * @property {string} text
 * @property {number} size
 * @property {'top' | 'middle' | 'bottom'} baseline
 * @property {'left' | 'center' | 'right'} alignment
 * @property {string} font
 * @property {number} [maxWidth]
 *
 *
 * @typedef {GlassEntryBase & GlassEntryTextArgs} GlassEntryText
 *
 *
 * @typedef {object} GlassEntryTriangleArgs
 * @property {'triangle'} type
 * @property {number} length1
 * @property {number} angle1
 * @property {number} length2
 * @property {number} angle2
 *
 *
 * @typedef {GlassEntryBase & GlassEntryBaseMouse & GlassEntryTriangleArgs} GlassEntryTriangle
 *
 *
 * @typedef {GlassEntryRect | GlassEntryArc | GlassEntryEllipse | GlassEntryText | GlassEntryTriangle} GlassEntry
 *
 *
 * @typedef {object} GlassColorGradientLinear
 * @property {'linear'} type
 * @property {number} x0
 * @property {number} y0
 * @property {number} x1
 * @property {number} y1
 *
 *
 * @typedef {object} GlassColorGradientRadial
 * @property {'radial'} type
 * @property {number} x0
 * @property {number} y0
 * @property {number} r0
 * @property {number} x1
 * @property {number} y1
 * @property {number} r1
 *
 *
 * @typedef {object} GlassColorGradientConic
 * @property {'conic'} type
 * @property {number} x
 * @property {number} y
 * @property {number} startAngle
 *
 *
 * @typedef {object} GlassColorGradientBase
 * @property {{t:number,color:string}[]} colorStops
 * @property {(t:number,color:string)=>any} addColorStop
 *
 *
 * @typedef {GlassColorGradientBase & (GlassColorGradientLinear | GlassColorGradientRadial | GlassColorGradientConic)} GlassColorGradient
 *
 *
 * @typedef {object} GlassDrawCallOptionsBase
 * @property {string} color A canvas compatible color string.
 * @property {number} [lineWidth] When `lineWidth` is `0` the shape is filled instead of outlined, defaults to `0`.
 * @property {number} [shadowBlur] Defaults to `0`.
 * @property {string} [shadowColor] A canvas compatible color string.
 * @property {number} [shadowOffsetX] Defaults to `0`. TODO
 * @property {number} [shadowOffsetY] Defaults to `0`. TODO
 * @property {boolean} [static] TODO, defaults to `false`.
 * @property {number} [layer] The layer used for rendering order and click events, larger numbers are added last, and so are rendered on top and are the first to be clicked.
 *
 *
 * @typedef {GlassDrawCallOptionsBase} GlassDrawCallOptionsNoMouse
 *
 *
 * @typedef {object} GlassDrawCallOptionsMouseProps
 * @property {'ignore'|'passthrough'|'consume'} [mouseMode] `ignore` lets the click through without effect, `passthrough` lets the click through while still triggering click events, `consume` triggers click events and does not let the click through.
 * @property {function} [onClick]
 *
 *
 * @typedef {GlassDrawCallOptionsBase & GlassDrawCallOptionsMouseProps} GlassDrawCallOptions
 */

/**
 * Type guard to check if an entry has the required mouse interaction methods.
 * @param {GlassEntry} entry
 * @returns {entry is GlassEntry & { hasPoint: (x: number, y: number) => boolean, onClick: () => any }}
 */
const isClickableEntry = entry => entry.mouseMode !== 'ignore' && typeof entry.hasPoint === 'function'

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {GlassEntry} entry
 * @param {boolean} [onlyStyle] Defaults to `false`.
 */
const ctxClose = (ctx, entry, onlyStyle = false) => {
  if (typeof entry.color !== 'string') throw new TypeError('Non string color passed to ctxClose')
  if (entry.shadowBlur) {
    ctx.shadowBlur = entry.shadowBlur
    ctx.shadowColor = entry.shadowColor ?? ''
  } else ctx.shadowBlur = 0
  if (entry.lineWidth) {
    ctx.strokeStyle = entry.color
    ctx.lineWidth = entry.lineWidth
    if (!onlyStyle) ctx.stroke()
  } else {
    ctx.fillStyle = entry.color
    if (!onlyStyle) ctx.fill()
  }
}

/**
 * @param {number} cx
 * @param {number} cy
 * @param {object} bounds
 * @param {number} bounds.minX
 * @param {number} bounds.minY
 * @param {number} bounds.maxX
 * @param {number} bounds.maxY
 * @param {number} rotation
 * @returns {{minX:number,minY:number,maxX:number,maxY:number}}
 */
const rotateBounds = (cx, cy, bounds, rotation) => {
  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  const rads = (rotation * Math.PI) / 180

  for (const point of [
    [bounds.minX, bounds.minY],
    [bounds.maxX, bounds.minY],
    [bounds.maxX, bounds.maxY],
    [bounds.minX, bounds.maxY]
  ]) {
    const x = point[0] - cx
    const y = point[1] - cy
    const rotatedX = x * Math.cos(rads) - y * Math.sin(rads)
    const rotatedY = x * Math.sin(rads) + y * Math.cos(rads)
    point[0] = rotatedX + cx
    point[1] = rotatedY + cy
    minX = Math.min(minX, point[0])
    minY = Math.min(minY, point[1])
    maxX = Math.max(maxX, point[0])
    maxY = Math.max(maxY, point[1])
  }

  return { minX, minY, maxX, maxY }
}

/**
 * @template {object | any[]} T
 * @param {T} obj
 * @returns {T}
 */
const copyObject = obj => {
  if (Array.isArray(obj)) {
    const newArr = []
    for (const value of obj) {
      newArr.push(typeof value === 'object' && value !== null ? copyObject(value) : value)
    }
    return /** @type {T} */ (newArr)
  }
  if (obj !== null && typeof obj === 'object') {
    /** @type {{ [key: string]: any }} */
    const newObj = {}
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = typeof value === 'object' && value !== null ? copyObject(value) : value
    }
    return /** @type {T} */ (newObj)
  }
  return obj
}

/**
 * @param {number} scale
 * @param {{minX:number,minY:number,maxX:number,maxY:number}} bounds
 */
const scaleBounds = (scale, bounds) => {
  bounds.minX *= scale
  bounds.minY *= scale
  bounds.maxX *= scale
  bounds.maxY *= scale
}

/**
 * @param {number} x
 * @param {number} y
 * @param {{minX:number,minY:number,maxX:number,maxY:number}} bounds
 */
const shiftBounds = (x, y, bounds) => {
  bounds.minX += x
  bounds.minY += y
  bounds.maxX += x
  bounds.maxY += y
}

/**
 * @class
 */
class Glass {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    if (this.ctx === null) throw new Error('Error getting ctx')
    requestAnimationFrame(this.render)
    canvas.addEventListener('click', event => this._clickHandler(event))
  }

  /** The mode used the canvas's width and height.
   * - `'fit'`: The canvas's size will adjust to fit it's parent element.
   * - `'manual'`: The canvas's size will not adjust, but manual adjustments to the size will still be used.
   * @type {'fit' | 'manual'}
   */
  canvasMode = 'fit'

  /** The mode used for the viewport's scale and position.
   * - `'auto'`: The viewport will scale to fit all the content drawn.
   * - `'manual'`: The viewport's scale and position can be controlled manually using the `viewportWidth`, `viewportHeight`, `viewportX` and `viewportY` properties.
   * @type {'auto' | 'manual'}
   */
  viewportMode = 'auto'

  /** @type {number} */
  viewportWidth = 100

  /** @type {number} */
  viewportHeight = 100

  /** The center of the viewport.
   * @type {number}
   */
  viewportX = 0

  /** The center of the viewport.
   * @type {number}
   */
  viewportY = 0

  /**
   * - `'auto'`: Renders every animation frame, based off the `window.requestAnimationFrame()` function.
   * - `'manual'`: Only renders when `render()` is called.
   * @type {'auto' | 'manual'}
   */
  renderMode = 'auto'

  /**
   * @typedef {'beforeRender' | 'beforeShift' | 'beforeScale' | 'afterScale' | 'afterRender' | 'resize'} GlassEvent
   */

  /**
   * @type {Record<GlassEvent, ((event?:object|undefined) => any)[]>}
   */
  _listeners = {
    beforeRender: [],
    beforeShift: [],
    beforeScale: [],
    afterScale: [],
    afterRender: [],
    resize: []
  }

  /**
   * Adds a callback to be run when the event of type is called, callbacks are run in the order they were added, use `off(type, listener)` to remove.
   * The types are as follows:
   * - `beforeRender`: Is the first thing to run in the render function, it is suggested you call most of draw calls here.
   * - `beforeShift`: Runs right after, this can be used to change any entries added in the last event.
   * - `beforeScale`: Runs after every entry has been scaled, but before they have been normalized to the canvas size.
   * - `afterScale`: Is the last event to run before the actual rendering.
   * @param {GlassEvent} type
   * @param {(event:object|undefined)=>any} listener
   */
  on = (type, listener) => this._listeners[type].push(listener)

  /**
   * Removes the last instance of the callback from the list of callbacks to be run when the event of type is called, if no callback matches nothing happens.
   * @param {GlassEvent} type
   * @param {(event:object|undefined)=>any} listener
   */
  off = (type, listener) =>
    this._listeners[type].includes(listener) &&
    this._listeners[type].splice(this._listeners[type].lastIndexOf(listener), 1)

  /** @type {String} */
  backgroundColor = '#000'
  /** @type {String} */
  outsideColor = '#fff'

  staticPaneWidth = 1000
  staticPaneHeight = 1000
  /** Where the static pane should go if it is not the same ratio as the viewport.
   * @type {'top' | 'right' | 'bottom' | 'left' | 'center'}
   */
  staticPaneMode = 'center'

  /** @type {GlassEntry[]} */
  _renderStack = []

  _lastSize = { width: 0, height: 0 }

  /**
   * @type {{renderStack:GlassEntry[],canvasWidth:number,canvasHeight:number}}
   */
  _lastRender = { renderStack: [], canvasWidth: 0, canvasHeight: 0 }

  /**
   * @param {{x:number,y:number}} event
   */
  _clickHandler(event) {
    const renderStack = [...this._lastRender.renderStack].sort(() => -1)
    const x = event.x
    const y = event.y
    for (const entry of renderStack.filter(entry => isClickableEntry(entry))) {
      if (
        x >= entry.bounds.minX &&
        x <= entry.bounds.maxX &&
        y >= entry.bounds.minY &&
        y <= entry.bounds.maxY &&
        entry.hasPoint(x, y)
      ) {
        entry.onClick()
        if (entry.mouseMode !== 'passthrough') break
      }
    }
  }

  /** @type {boolean} Shows the bounding box of everything rendered with a blue outline. */
  showBounds = false

  /** @type {{color: Color, lineWidth: number}} */
  showBoundsOptions = {
    color: new Color('0f0'),
    lineWidth: 2.5
  }

  /** @type {boolean} Creates an overlay of a grid where each cell is colored based on how many objects can be clicked at that location. */
  showAreas = false

  /** @type {{hitColor: Color, hitCountForMaxColor: number, defaultColor: Color, targetCells: number}} */
  showAreasOptions = {
    /** @type {Color} */
    hitColor: new Color('0f0'),
    /** @type {number} */
    hitCountForMaxColor: 10,
    /** @type {Color} */
    defaultColor: new Color('f00'),
    /** @type {number} */
    targetCells: 10_000
  }

  /** @type {'ignore'|'passthrough'|'consume'} ignore lets the click through without effect, `'passthrough'` lets the click through while still triggering click events, `'consume'` triggers click events and does not let the click through. */
  defaultMouseMode = 'consume'

  render = (() => {
    const canvas = this.canvas
    /** @type {CanvasRenderingContext2D} */
    const ctx = this.ctx

    if (this.canvasMode === 'fit') {
      const parentElement = canvas.parentElement
      if (parentElement === null) throw new Error('Cannot get canvas parent')
      const parentSize = parentElement.getBoundingClientRect()
      canvas.style.width = `${parentSize.width}px`
      canvas.style.height = `${parentSize.height}px`
      canvas.width = parentSize.width
      canvas.height = parentSize.height
    }

    const renderStack = this._renderStack

    if (canvas.width !== this._lastSize.width || canvas.height !== this._lastSize.height) {
      for (const listener of this._listeners.resize)
        listener({
          canvas,
          ctx,
          renderStack,
          canvasWidth: canvas.width,
          canvasHeight: canvas.height
        })
      this._lastSize.width = canvas.width
      this._lastSize.height = canvas.height
    }

    for (const listener of this._listeners.beforeRender)
      listener({
        canvas,
        ctx,
        renderStack,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
      })

    if (this._renderStack.length === 0) return
    if (this.viewportMode === 'auto') {
      let minX = Number.POSITIVE_INFINITY
      let minY = Number.POSITIVE_INFINITY
      let maxX = Number.NEGATIVE_INFINITY
      let maxY = Number.NEGATIVE_INFINITY
      for (const entry of renderStack) {
        if (!entry.static) {
          const bounds = entry.bounds
          minX = Math.min(minX, bounds.minX)
          minY = Math.min(minY, bounds.minY)
          maxX = Math.max(maxX, bounds.maxX)
          maxY = Math.max(maxY, bounds.maxY)
        }
      }
      if (Number.isNaN(minX + minY + maxX + maxY)) throw new Error('Invalid bounds on renderstack item.')
      if (minX === Number.POSITIVE_INFINITY) minX = minY = maxX = maxY = 0
      this.viewportX = (minX + maxX) / 2
      this.viewportY = (minY + maxY) / 2
      this.viewportWidth = maxX - minX
      this.viewportHeight = maxY - minY
    }
    renderStack.sort((a, b) => (a.layer ?? 0) - (b.layer ?? 0))
    const scale = Math.min(canvas.width / this.viewportWidth, canvas.height / this.viewportHeight)
    const shiftX = this.viewportWidth / 2 - this.viewportX
    const shiftY = this.viewportHeight / 2 - this.viewportY
    const staticScale = Math.min(
      (this.viewportWidth * scale) / this.staticPaneWidth,
      (this.viewportHeight * scale) / this.staticPaneHeight
    )
    const staticShiftX =
      this.staticPaneMode === 'left'
        ? 0
        : this.staticPaneMode === 'right'
          ? this.viewportWidth * scale - this.staticPaneWidth * staticScale
          : (this.viewportWidth * scale - this.staticPaneWidth * staticScale) / 2
    const staticShiftY =
      this.staticPaneMode === 'top'
        ? 0
        : this.staticPaneMode === 'bottom'
          ? this.viewportHeight * scale - this.staticPaneHeight * staticScale
          : (this.viewportHeight * scale - this.staticPaneHeight * staticScale) / 2
    for (const entry of renderStack) if (entry.static) entry.scale(staticScale)
    for (const listener of this._listeners.beforeShift)
      listener({
        canvas,
        ctx,
        renderStack,
        scale,
        shiftX,
        shiftY,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
      })
    for (const entry of renderStack)
      if (entry.static) entry.shift(staticShiftX, staticShiftY)
      else entry.shift(shiftX, shiftY)
    for (const listener of this._listeners.beforeScale)
      listener({
        canvas,
        ctx,
        renderStack,
        scale,
        shiftX,
        shiftY,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
      })
    for (const entry of renderStack) if (!entry.static) entry.scale(scale)
    for (const listener of this._listeners.afterScale)
      listener({
        canvas,
        ctx,
        renderStack,
        scale,
        shiftX,
        shiftY,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
      })

    const offsetX = (canvas.width - this.viewportWidth * scale) / 2
    const offsetY = (canvas.height - this.viewportHeight * scale) / 2

    ctx.fillStyle = this.backgroundColor
    ctx.fillRect(offsetX, offsetY, this.viewportWidth * scale, this.viewportHeight * scale)
    for (const entry of renderStack) {
      if (typeof entry.color === 'object' && entry.color !== null && 'type' in entry.color) {
        const color = entry.color
        let grad
        if (color.type === 'linear')
          grad = ctx.createLinearGradient(
            (color.x0 + shiftX) * scale + offsetX,
            (color.y0 + shiftY) * scale + offsetY,
            (color.x1 + shiftX) * scale + offsetX,
            (color.y1 + shiftY) * scale + offsetY
          )
        else if (color.type === 'radial')
          grad = ctx.createRadialGradient(
            (color.x0 + shiftX) * scale + offsetX,
            (color.y0 + shiftY) * scale + offsetY,
            color.r0 * scale,
            (color.x1 + shiftX) * scale + offsetX,
            (color.y1 + shiftY) * scale + offsetY,
            color.r1 * scale
          )
        else if (color.type === 'conic')
          grad = ctx.createConicGradient(
            color.startAngle,
            (color.x + shiftX) * scale + offsetX,
            (color.y + shiftY) * scale + offsetY
          )
        else throw new TypeError('Invalid gradient type used for color')

        for (const stop of color.colorStops) grad.addColorStop(stop.t, stop.color)

        entry.color = grad
      }
      entry.shift(offsetX, offsetY)
      entry.render(ctx)
    }
    ctx.shadowBlur = 0
    ctx.fillStyle = this.outsideColor
    ctx.fillRect(0, 0, offsetX, canvas.height)
    ctx.fillRect(0, 0, canvas.width, offsetY)
    ctx.fillRect(canvas.width - offsetX, 0, offsetX, canvas.height)
    ctx.fillRect(0, canvas.height - offsetY, canvas.width, offsetY)
    for (const listener of this._listeners.afterRender)
      listener({
        canvas,
        ctx,
        renderStack,
        scale,
        shiftX,
        shiftY,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
      })

    if (this.renderMode === 'auto') requestAnimationFrame(this.render.bind(this))
    this._lastRender = copyObject({
      viewportX: this.viewportX,
      viewportY: this.viewportY,
      viewportWidth: this.viewportWidth,
      viewportHeight: this.viewportHeight,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      offsetX,
      offsetY,
      renderStack
    })

    if (this.showAreas) {
      const cellSize = Math.max(
        1,
        Math.floor(Math.sqrt((canvas.width * canvas.height) / this.showAreasOptions.targetCells))
      )
      const cells = new Array(Math.ceil(canvas.width / cellSize))
        .fill(0)
        .map(() => new Array(Math.ceil(canvas.height / cellSize)).fill(0))
      for (let x = 0; x < canvas.width; x += cellSize)
        for (let y = 0; y < canvas.height; y += cellSize) {
          const lastRender = this._lastRender
          x = (x * lastRender.canvasWidth) / this.canvas.width
          y = (y * lastRender.canvasHeight) / this.canvas.height
          for (const entry of renderStack.filter(entry => isClickableEntry(entry))) {
            if (
              x >= entry.bounds.minX &&
              x <= entry.bounds.maxX &&
              y >= entry.bounds.minY &&
              y <= entry.bounds.maxY &&
              entry.hasPoint(x, y)
            ) {
              cells[x / cellSize][y / cellSize]++
            }
          }
        }
      for (let x = 0; x < cells.length; x++)
        for (let y = 0; y < cells[0].length; y++) {
          ctx.fillStyle = cells[x][y] ? `rgb(0,255,0,${cells[x][y] / 1})` : '#f003'
          ctx.fillStyle = this.showAreasOptions.defaultColor.lerp(
            this.showAreasOptions.hitColor,
            Math.min(cells[x][y] / this.showAreasOptions.hitCountForMaxColor, 1)
          ).hex
          ctx.fillRect(x * cellSize - cellSize / 2, y * cellSize - cellSize / 2, cellSize, cellSize)
        }
    }

    if (this.showBounds) {
      ctx.strokeStyle = this.showBoundsOptions.color.hex
      ctx.lineWidth = this.showBoundsOptions.lineWidth
      for (const entry of renderStack) {
        ctx.beginPath()
        ctx.rect(
          entry.bounds.minX,
          entry.bounds.minY,
          entry.bounds.maxX - entry.bounds.minX,
          entry.bounds.maxY - entry.bounds.minY
        )
        ctx.stroke()
      }
    }

    this._renderStack.splice(0)
  }).bind(this)

  /**
   * @param {number} x0
   * @param {number} y0
   * @param {number} x1
   * @param {number} y1
   * @returns {GlassColorGradient}
   */
  createLinearGradient = (x0, y0, x1, y1) => ({
    type: 'linear',
    x0,
    y0,
    x1,
    y1,
    colorStops: [],
    /**
     * @param {number} t
     * @param {string} color
     */
    addColorStop(t, color) {
      this.colorStops.push({ t, color })
      this.colorStops.sort((a, b) => a.t - b.t)
    }
  })

  /**
   * @param {number} x0
   * @param {number} y0
   * @param {number} r0
   * @param {number} x1
   * @param {number} y1
   * @param {number} r1
   * @returns {GlassColorGradient}
   */
  createRadialGradient = (x0, y0, r0, x1, y1, r1) => ({
    type: 'radial',
    x0,
    y0,
    r0,
    x1,
    y1,
    r1,
    colorStops: [],
    /**
     * @param {number} t
     * @param {string} color
     */
    addColorStop(t, color) {
      this.colorStops.push({ t, color })
      this.colorStops.sort((a, b) => a.t - b.t)
    }
  })

  /**
   * @param {number} startAngle
   * @param {number} x
   * @param {number} y
   * @returns {GlassColorGradient}
   */
  createConicGradient = (startAngle, x, y) => ({
    type: 'conic',
    startAngle,
    x,
    y,
    colorStops: [],
    /**
     * @param {number} t
     * @param {string} color
     */
    addColorStop(t, color) {
      this.colorStops.push({ t, color })
      this.colorStops.sort((a, b) => a.t - b.t)
    }
  })

  /**
   * @param {object} shapeDefinition
   * @param {number} shapeDefinition.x
   * @param {number} shapeDefinition.y
   * @param {number} shapeDefinition.width
   * @param {number} shapeDefinition.height
   * @param {number} [shapeDefinition.rotation] In degrees, clockwise with `0` being up, defaults to `0`.
   * @param {'corner' | 'center'} [shapeDefinition.coordinateMode] What part of the rect the x\y is, `'corner'` means top left corner, defaults to `'corner'`.
   * @param {GlassDrawCallOptions} options
   * @param {any} [tags]
   * @return {GlassEntryRect}
   */
  rect(shapeDefinition, options, ...tags) {
    shapeDefinition.rotation = (((shapeDefinition.rotation ?? 0) % 360) + 360) % 360
    shapeDefinition.coordinateMode = shapeDefinition.coordinateMode ?? 'corner'
    options.lineWidth = options.lineWidth ?? 0
    options.mouseMode = options.mouseMode ?? this.defaultMouseMode

    /** @type {GlassEntryRect} */
    const entry = {
      type: 'rect',
      ...shapeDefinition,
      rotation: shapeDefinition.rotation,
      coordinateMode: shapeDefinition.coordinateMode,
      ...options,
      lineWidth: options.lineWidth,
      mouseMode: options.mouseMode,
      tags,
      bounds: (() => {
        let minX = Number.POSITIVE_INFINITY
        let minY = Number.POSITIVE_INFINITY
        let maxX = Number.NEGATIVE_INFINITY
        let maxY = Number.NEGATIVE_INFINITY
        const points =
          shapeDefinition.coordinateMode === 'corner'
            ? [
                [shapeDefinition.x, shapeDefinition.y],
                [shapeDefinition.x + shapeDefinition.width, shapeDefinition.y],
                [shapeDefinition.x + shapeDefinition.width, shapeDefinition.y + shapeDefinition.height],
                [shapeDefinition.x, shapeDefinition.y + shapeDefinition.height]
              ]
            : [
                [shapeDefinition.x - shapeDefinition.width / 2, shapeDefinition.y - shapeDefinition.height / 2],
                [shapeDefinition.x + shapeDefinition.width / 2, shapeDefinition.y - shapeDefinition.height / 2],
                [shapeDefinition.x + shapeDefinition.width / 2, shapeDefinition.y + shapeDefinition.height / 2],
                [shapeDefinition.x - shapeDefinition.width / 2, shapeDefinition.y + shapeDefinition.height / 2]
              ]

        for (const point of points) {
          const x = point[0] - shapeDefinition.x
          const y = point[1] - shapeDefinition.y
          const rotatedX =
            x * Math.cos((shapeDefinition.rotation * Math.PI) / 180) -
            y * Math.sin((shapeDefinition.rotation * Math.PI) / 180)
          const rotatedY =
            x * Math.sin((shapeDefinition.rotation * Math.PI) / 180) +
            y * Math.cos((shapeDefinition.rotation * Math.PI) / 180)
          point[0] = rotatedX + shapeDefinition.x
          point[1] = rotatedY + shapeDefinition.y
          minX = Math.min(minX, point[0])
          minY = Math.min(minY, point[1])
          maxX = Math.max(maxX, point[0])
          maxY = Math.max(maxY, point[1])
        }
        return {
          minX: minX - options.lineWidth / 2,
          minY: minY - options.lineWidth / 2,
          maxX: maxX + options.lineWidth / 2,
          maxY: maxY + options.lineWidth / 2
        }
      })(),
      /**
       * @param {number} px
       * @param {number} py
       * @returns {boolean}
       */
      hasPoint(px, py) {
        const x = px - this.x
        const y = py - this.y
        const rotatedX = x * Math.cos((-this.rotation * Math.PI) / 180) - y * Math.sin((-this.rotation * Math.PI) / 180)
        const rotatedY = x * Math.sin((-this.rotation * Math.PI) / 180) + y * Math.cos((-this.rotation * Math.PI) / 180)
        px = rotatedX + this.x
        py = rotatedY + this.y

        return shapeDefinition.coordinateMode === 'corner'
          ? px >= this.x && px <= this.x + this.width && py >= this.y && py <= this.y + this.height
          : px >= this.x - this.width / 2 &&
              px <= this.x + this.width / 2 &&
              py >= this.y - this.height / 2 &&
              py <= this.y + this.height / 2
      },
      /**
       * @param {number} scale
       */
      scale(scale) {
        this.x *= scale
        this.y *= scale
        this.width *= scale
        this.height *= scale
        this.lineWidth *= scale
        scaleBounds(scale, this.bounds)
        if (options.shadowBlur) options.shadowBlur *= scale
      },
      /**
       * @param {number} x
       * @param {number} y
       */
      shift(x, y) {
        this.x += x
        this.y += y
        shiftBounds(x, y, this.bounds)
      },
      /** @param {CanvasRenderingContext2D} ctx */
      render(ctx) {
        ctx.beginPath()
        const points =
          this.coordinateMode === 'corner'
            ? [
                [this.x, this.y],
                [this.x + this.width, this.y],
                [this.x + this.width, this.y + this.height],
                [this.x, this.y + this.height]
              ]
            : [
                [this.x - this.width / 2, this.y - this.height / 2],
                [this.x + this.width / 2, this.y - this.height / 2],
                [this.x + this.width / 2, this.y + this.height / 2],
                [this.x - this.width / 2, this.y + this.height / 2]
              ]

        for (const point of points) {
          const x = point[0] - this.x
          const y = point[1] - this.y
          const rotatedX = x * Math.cos((this.rotation * Math.PI) / 180) - y * Math.sin((this.rotation * Math.PI) / 180)
          const rotatedY = x * Math.sin((this.rotation * Math.PI) / 180) + y * Math.cos((this.rotation * Math.PI) / 180)
          point[0] = rotatedX + this.x
          point[1] = rotatedY + this.y
        }

        ctx.moveTo(points[0][0], points[0][1])
        ctx.lineTo(points[1][0], points[1][1])
        ctx.lineTo(points[2][0], points[2][1])
        ctx.lineTo(points[3][0], points[3][1])
        ctx.lineTo(points[0][0], points[0][1])

        ctxClose(ctx, this)
      }
    }
    this._renderStack.push(entry)
    return entry
  }

  /**
   * @param {object} shapeDefinition
   * @param {number} shapeDefinition.x
   * @param {number} shapeDefinition.y
   * @param {number} shapeDefinition.radius
   * @param {number} [shapeDefinition.rotation] (this property exists only for continuity reasons, you can accomplish the same things with startAngle / endAngle) In degrees, clockwise with `0` being up, defaults to `0`.
   * @param {number} [shapeDefinition.startAngle] In degrees, clockwise with `0` being up, defaults to `0`.
   * @param {number} [shapeDefinition.endAngle] In degrees, clockwise with `0` being up, defaults to `0`.
   * @param {GlassDrawCallOptions} options
   * @param {any} [tags]
   * @return {GlassEntryArc}
   */
  arc(shapeDefinition, options, ...tags) {
    shapeDefinition.rotation = (((shapeDefinition.rotation ?? 0) % 360) + 360) % 360
    shapeDefinition.startAngle = (((shapeDefinition.startAngle ?? 0) % 360) + 360) % 360
    shapeDefinition.endAngle = (((shapeDefinition.endAngle ?? 0) % 360) + 360) % 360
    if (shapeDefinition.startAngle === shapeDefinition.endAngle) {
      shapeDefinition.startAngle = 0
      shapeDefinition.endAngle = 360
    }
    options.mouseMode = options.mouseMode ?? this.defaultMouseMode
    options.lineWidth = options.lineWidth ?? 0
    /** @type {GlassEntryArc} */
    const entry = {
      type: 'arc',
      ...shapeDefinition,
      rotation: shapeDefinition.rotation,
      startAngle: shapeDefinition.startAngle,
      endAngle: shapeDefinition.endAngle,
      ...options,
      lineWidth: options.lineWidth,
      mouseMode: options.mouseMode,
      tags,
      bounds: (() => {
        let minX = Number.POSITIVE_INFINITY
        let minY = Number.POSITIVE_INFINITY
        let maxX = Number.NEGATIVE_INFINITY
        let maxY = Number.NEGATIVE_INFINITY

        for (const angle of [0, 90, 180, 270, shapeDefinition.startAngle, shapeDefinition.endAngle].filter(
          (value, index, arr) => arr.indexOf(value) === index
        )) {
          if (shapeDefinition.startAngle > shapeDefinition.endAngle) {
            if (angle < shapeDefinition.startAngle && angle > shapeDefinition.endAngle) continue
          } else if (angle < shapeDefinition.startAngle || angle > shapeDefinition.endAngle) continue
          const px = Math.sin((angle * Math.PI) / 180) * shapeDefinition.radius + shapeDefinition.x
          const py = -Math.cos((angle * Math.PI) / 180) * shapeDefinition.radius + shapeDefinition.y
          minX = Math.min(minX, px)
          minY = Math.min(minY, py)
          maxX = Math.max(maxX, px)
          maxY = Math.max(maxY, py)
        }

        minX -= options.lineWidth / 2
        minY -= options.lineWidth / 2
        maxX += options.lineWidth / 2
        maxY += options.lineWidth / 2

        return {
          minX,
          minY,
          maxX,
          maxY
        }
      })(),
      /**
       * @param {number} px
       * @param {number} py
       * @returns {boolean}
       */
      hasPoint(px, py) {
        if (this.radius === undefined) throw new TypeError('Missing radius')

        // Translate the point by the center of the arc
        const translatedX = px - this.x
        const translatedY = py - this.y

        // Check if the point is within the circle's radius
        if (translatedX ** 2 + translatedY ** 2 > this.radius ** 2) return false // Point is outside the circle's radius

        // Check if it is a full circle
        if (this.startAngle === this.endAngle % 360) return true

        // Calculate the angle of the point relative to the center of the circle
        let pointAngle = (Math.atan2(translatedY, translatedX) * 180) / Math.PI // Angle in degrees
        pointAngle = (pointAngle + 360) % 360 // Normalize to [0, 360) range

        // Normalize the start and end angles to [0, 360) range
        const startAngle = (this.startAngle + 270) % 360
        const endAngle = (this.endAngle + 270) % 360

        if (startAngle > endAngle)
          // Handle the case where the arc spans across the 0-degree line
          return pointAngle >= startAngle || pointAngle <= endAngle
        // Normal case where startAngle < endAngle
        return pointAngle >= startAngle && pointAngle <= endAngle
      },
      /**
       * @param {number} scale
       */
      scale(scale) {
        if (this.radius === undefined) throw new TypeError('Missing radius')

        this.x *= scale
        this.y *= scale
        this.radius *= scale
        this.lineWidth *= scale
        scaleBounds(scale, this.bounds)
        if (this.shadowBlur) this.shadowBlur *= scale
      },
      /**
       * @param {number} x
       * @param {number} y
       */
      shift(x, y) {
        this.x += x
        this.y += y
        shiftBounds(x, y, this.bounds)
      },
      /** @param {CanvasRenderingContext2D} ctx */
      render(ctx) {
        ctx.beginPath()
        ctx.arc(
          this.x,
          this.y,
          this.radius,
          ((this.startAngle + 270) * Math.PI) / 180,
          ((this.endAngle + 270) * Math.PI) / 180
        )
        ctxClose(ctx, this)
      }
    }
    this._renderStack.push(entry)
    return entry
  }

  /**
   * @param {object} shapeDefinition
   * @param {number} shapeDefinition.x
   * @param {number} shapeDefinition.y
   * @param {number} shapeDefinition.radiusX
   * @param {number} shapeDefinition.radiusY
   * @param {number} [shapeDefinition.rotation] In degrees, clockwise with `0` being up, defaults to `0`.
   * @param {number} [shapeDefinition.startAngle] In degrees, clockwise with `0` being up, defaults to `0`.
   * @param {number} [shapeDefinition.endAngle] In degrees, clockwise with `0` being up, defaults to `0`.
   * @param {GlassDrawCallOptions} options
   * @param {any} [tags]
   * @return {GlassEntryEllipse}
   */
  ellipse(shapeDefinition, options, ...tags) {
    shapeDefinition.rotation = (((shapeDefinition.rotation ?? 0) % 360) + 360) % 360
    shapeDefinition.startAngle = (((shapeDefinition.startAngle ?? 0) % 360) + 360) % 360
    shapeDefinition.endAngle = (((shapeDefinition.endAngle ?? 0) % 360) + 360) % 360
    if (shapeDefinition.startAngle === shapeDefinition.endAngle) {
      shapeDefinition.startAngle = 0
      shapeDefinition.endAngle = 360
    }
    options.lineWidth = options.lineWidth ?? 0
    options.mouseMode = options.mouseMode ?? this.defaultMouseMode

    /** @type {GlassEntryEllipse} */
    const obj = {
      type: 'ellipse',
      ...shapeDefinition,
      rotation: shapeDefinition.rotation,
      startAngle: shapeDefinition.startAngle,
      endAngle: shapeDefinition.endAngle,
      ...options,
      lineWidth: options.lineWidth,
      mouseMode: options.mouseMode,
      tags,
      bounds: (() => {
        let minX = Number.POSITIVE_INFINITY
        let minY = Number.POSITIVE_INFINITY
        let maxX = Number.NEGATIVE_INFINITY
        let maxY = Number.NEGATIVE_INFINITY

        const radians = (shapeDefinition.rotation * Math.PI) / 180
        const shiftedStartAngle = (shapeDefinition.startAngle + 270) % 360
        const shiftedEndAngle = (shapeDefinition.endAngle + 270) % 360
        const angles = [shiftedStartAngle, shiftedEndAngle]

        const x1 = Math.cos(radians) * shapeDefinition.radiusX
        const x2 = -Math.sin(radians) * shapeDefinition.radiusY
        const xa = Math.atan2(x2, x1)
        angles.push(((xa * 180) / Math.PI + 360) % 360, ((xa * 180) / Math.PI + 180) % 360)
        const y1 = Math.sin(radians) * shapeDefinition.radiusX
        const y2 = Math.cos(radians) * shapeDefinition.radiusY
        const ya = Math.atan2(y2, y1)
        angles.push(((ya * 180) / Math.PI + 360) % 360, ((ya * 180) / Math.PI + 180) % 360)

        for (const angle of angles.filter((value, index, arr) => arr.indexOf(value) === index)) {
          if (shiftedStartAngle !== shiftedEndAngle) {
            if (shiftedStartAngle > shiftedEndAngle) {
              if (angle < shiftedStartAngle && angle > shiftedEndAngle) continue
            } else if (angle < shiftedStartAngle || angle > shiftedEndAngle) continue
          }
          let px = Math.cos((angle * Math.PI) / 180) * shapeDefinition.radiusX
          let py = Math.sin((angle * Math.PI) / 180) * shapeDefinition.radiusY
          {
            const cos = Math.cos((shapeDefinition.rotation * Math.PI) / 180)
            const sin = -Math.sin((shapeDefinition.rotation * Math.PI) / 180)
            ;[px, py] = [cos * px + sin * py, cos * py - sin * px]
          }
          px += shapeDefinition.x
          py += shapeDefinition.y

          minX = Math.min(minX, px)
          minY = Math.min(minY, py)
          maxX = Math.max(maxX, px)
          maxY = Math.max(maxY, py)
        }
        minX -= options.lineWidth / 2
        minY -= options.lineWidth / 2
        maxX += options.lineWidth / 2
        maxY += options.lineWidth / 2

        return {
          minX,
          minY,
          maxX,
          maxY
        }
      })(),
      /**
       * @param {number} px
       * @param {number} py
       * @returns {boolean}
       */
      hasPoint(px, py) {
        px -= this.x
        py -= this.y
        const ratio = this.radiusX / this.radiusY
        const radians = (Math.PI / 180) * this.rotation
        const cos = Math.cos(radians)
        const sin = Math.sin(radians)
        ;[px, py] = [cos * px + sin * py, cos * py - sin * px]
        py *= ratio
        const distance = Math.sqrt(px ** 2 + py ** 2)
        if (distance > this.radiusX) return false
        if (this.startAngle === this.endAngle % 360) return true
        const angle = (-((Math.atan2(px, py) / Math.PI) * 180) + 360 + 180) % 360
        const normalizedStartAngle = this.startAngle % 360
        const normalizedEndAngle = this.endAngle % 360
        if (normalizedStartAngle > normalizedEndAngle)
          return angle >= normalizedStartAngle || angle <= normalizedEndAngle
        return angle >= normalizedStartAngle && angle <= normalizedEndAngle
      },
      /**
       * @param {number} scale
       */
      scale(scale) {
        this.x *= scale
        this.y *= scale
        this.radiusX *= scale
        this.radiusY *= scale
        this.lineWidth *= scale
        scaleBounds(scale, this.bounds)
        if (options.shadowBlur) options.shadowBlur *= scale
      },
      /**
       * @param {number} x
       * @param {number} y
       */
      shift(x, y) {
        this.x += x
        this.y += y
        shiftBounds(x, y, this.bounds)
      },
      /** @param {CanvasRenderingContext2D} ctx */
      render(ctx) {
        ctx.beginPath()
        ctx.ellipse(
          this.x,
          this.y,
          this.radiusX,
          this.radiusY,
          (this.rotation * Math.PI) / 180,
          ((this.startAngle + 270) * Math.PI) / 180,
          ((this.endAngle + 270) * Math.PI) / 180
        )
        ctxClose(ctx, this)
      }
    }
    this._renderStack.push(obj)
    return obj
  }

  /**
   * @param {object} textDefinition
   * @param {number} textDefinition.x
   * @param {number} textDefinition.y
   * @param {string} textDefinition.text
   * @param {'top'|'middle'|'bottom'} [textDefinition.baseline] Defaults to `'bottom'`.
   * @param {'left'|'center'|'right'} [textDefinition.alignment] Defaults to `'left'`.
   * @param {string} [textDefinition.font] Defaults to `'Arial'`.
   * @param {number} textDefinition.size
   * @param {number} [textDefinition.rotation] In degrees, clockwise with `0` being up, defaults to `0`.
   * @param {number} [textDefinition.maxWidth] Defaults to none.
   * @param {GlassDrawCallOptionsNoMouse} options
   * @param {any} [tags]
   * @return {GlassEntryText}
   */
  text(textDefinition, options, ...tags) {
    options.lineWidth = options.lineWidth ?? 0
    textDefinition.text = String(textDefinition.text)
    textDefinition.baseline = textDefinition.baseline ?? 'bottom'
    textDefinition.alignment = textDefinition.alignment ?? 'left'
    textDefinition.font = textDefinition.font ?? 'Arial'
    textDefinition.rotation = textDefinition.rotation ?? 0
    this.ctx.font = `${textDefinition.size}px ${textDefinition.font}`
    /** @type {GlassEntryText} */
    const entry = {
      type: 'text',
      mouseMode: 'ignore',
      ...textDefinition,
      rotation: textDefinition.rotation,
      baseline: textDefinition.baseline,
      alignment: textDefinition.alignment,
      font: textDefinition.font,
      ...options,
      lineWidth: options.lineWidth,
      tags,
      bounds: (() => {
        let minX = textDefinition.x - options.lineWidth / 2
        let minY = textDefinition.y - options.lineWidth / 2
        const width = Math.min(
          this.ctx.measureText(textDefinition.text).width,
          textDefinition.maxWidth ?? Number.POSITIVE_INFINITY
        )
        if (textDefinition.baseline === 'middle') minY -= textDefinition.size / 2
        else if (textDefinition.baseline === 'bottom') minY -= textDefinition.size
        if (textDefinition.alignment === 'center') minX -= width / 2
        else if (textDefinition.alignment === 'right') minX -= width

        return rotateBounds(
          textDefinition.x,
          textDefinition.y,
          {
            minX,
            minY,
            maxX: minX + width + options.lineWidth / 2,
            maxY: minY + textDefinition.size + options.lineWidth / 2
          },
          textDefinition.rotation
        )
      })(),
      /**
       * @param {number} scale
       */
      scale(scale) {
        if (this.size === undefined) throw new TypeError('Missing size')
        this.x *= scale
        this.y *= scale
        this.size *= scale
        this.lineWidth *= scale
        if (this.maxWidth) this.maxWidth *= scale
        scaleBounds(scale, this.bounds)
        if (options.shadowBlur) options.shadowBlur *= scale
      },
      /**
       * @param {number} x
       * @param {number} y
       */
      shift(x, y) {
        this.x += x
        this.y += y
        shiftBounds(x, y, this.bounds)
      },
      /** @param {CanvasRenderingContext2D} ctx */
      render(ctx) {
        if (this.text === undefined) throw new TypeError('Missing text')

        if (this.rotation) {
          ctx.save()
          ctx.translate(this.x, this.y)
          ctx.rotate((this.rotation * Math.PI) / 180)
          ctx.translate(-this.x, -this.y)
        }
        ctx.textAlign = this.alignment
        ctx.textBaseline = this.baseline
        ctx.font = `${this.size}px ${this.font}`
        ctxClose(ctx, this, true)
        if (this.lineWidth) ctx.strokeText(this.text, this.x, this.y, this.maxWidth)
        else ctx.fillText(this.text, this.x, this.y, this.maxWidth)
        if (this.rotation) ctx.restore()
      }
    }
    this._renderStack.push(entry)
    return entry
  }

  /**
   * Create a triangle at x/y, with "legs" coming from that point to form two sides, with the final side connecting both legs ends.
   * @param {object} shapeDefinition
   * @param {number} shapeDefinition.x
   * @param {number} shapeDefinition.y
   * @param {number} shapeDefinition.length1
   * @param {number} shapeDefinition.angle1
   * @param {number} shapeDefinition.length2
   * @param {number} shapeDefinition.angle2
   * @param {number} [shapeDefinition.rotation] In degrees, clockwise with `0` being up, defaults to `0`.
   * @param {GlassDrawCallOptions} options
   * @param {any} [tags]
   * @return {GlassEntryTriangle}
   */
  triangle(shapeDefinition, options, ...tags) {
    shapeDefinition.rotation = (((shapeDefinition.rotation ?? 0) % 360) + 360) % 360
    shapeDefinition.angle1 = (((shapeDefinition.angle1 ?? 0) % 360) + 360) % 360
    shapeDefinition.angle2 = (((shapeDefinition.angle2 ?? 0) % 360) + 360) % 360

    options.lineWidth = options.lineWidth ?? 0
    options.mouseMode = options.mouseMode ?? this.defaultMouseMode
    /** @type {GlassEntryTriangle} */
    const entry = {
      type: 'triangle',
      ...shapeDefinition,
      rotation: shapeDefinition.rotation,
      ...options,
      lineWidth: options.lineWidth,
      mouseMode: options.mouseMode,
      tags,
      bounds: (() => {
        let minX = Number.POSITIVE_INFINITY
        let minY = Number.POSITIVE_INFINITY
        let maxX = Number.NEGATIVE_INFINITY
        let maxY = Number.NEGATIVE_INFINITY
        for (const point of [
          [shapeDefinition.x, shapeDefinition.y],
          [
            Math.cos((shapeDefinition.angle1 * Math.PI) / 180 + Math.PI * 1.5) * shapeDefinition.length1 +
              shapeDefinition.x,
            Math.sin((shapeDefinition.angle1 * Math.PI) / 180 + Math.PI * 1.5) * shapeDefinition.length1 +
              shapeDefinition.y
          ],
          [
            Math.cos((shapeDefinition.angle2 * Math.PI) / 180 + Math.PI * 1.5) * shapeDefinition.length2 +
              shapeDefinition.x,
            Math.sin((shapeDefinition.angle2 * Math.PI) / 180 + Math.PI * 1.5) * shapeDefinition.length2 +
              shapeDefinition.y
          ]
        ]) {
          const cos = Math.cos((shapeDefinition.rotation * Math.PI) / 180)
          const sin = -Math.sin((shapeDefinition.rotation * Math.PI) / 180)
          const [x, y] = [cos * point[0] + sin * point[1], cos * point[1] - sin * point[0]]
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
        }
        return {
          minX: minX - options.lineWidth / 2,
          minY: minY - options.lineWidth / 2,
          maxX: maxX + options.lineWidth / 2,
          maxY: maxY + options.lineWidth / 2
        }
      })(),
      /**
       * @param {number} px
       * @param {number} py
       * @returns {boolean}
       */
      hasPoint(px, py) {
        const cos = Math.cos((this.rotation * Math.PI) / 180)
        const sin = Math.sin((this.rotation * Math.PI) / 180)

        /** @type {number[]} */
        const [x1, y1, x2, y2, x3, y3] = [
          {
            x: 0,
            y: 0
          },
          {
            x: Math.cos((this.angle1 * Math.PI) / 180 + Math.PI * 1.5) * this.length1,
            y: Math.sin((this.angle1 * Math.PI) / 180 + Math.PI * 1.5) * this.length1
          },
          {
            x: Math.cos((this.angle2 * Math.PI) / 180 + Math.PI * 1.5) * this.length2,
            y: Math.sin((this.angle2 * Math.PI) / 180 + Math.PI * 1.5) * this.length2
          }
        ].flatMap(point => [cos * point.x - sin * point.y + this.x, sin * point.x + cos * point.y + this.y])

        const v0x = x3 - x1
        const v0y = y3 - y1
        const v1x = x2 - x1
        const v1y = y2 - y1
        const v2x = px - x1
        const v2y = py - y1

        const dot00 = v0x * v0x + v0y * v0y
        const dot01 = v0x * v1x + v0y * v1y
        const dot02 = v0x * v2x + v0y * v2y
        const dot11 = v1x * v1x + v1y * v1y
        const dot12 = v1x * v2x + v1y * v2y

        const denom = dot00 * dot11 - dot01 * dot01
        const u = (dot11 * dot02 - dot01 * dot12) / denom
        const v = (dot00 * dot12 - dot01 * dot02) / denom

        return u >= 0 && v >= 0 && u + v <= 1
      },
      /**
       * @param {number} scale
       */
      scale(scale) {
        this.x *= scale
        this.y *= scale
        this.length1 *= scale
        this.length2 *= scale
        this.lineWidth *= scale
        scaleBounds(scale, this.bounds)
        if (options.shadowBlur) options.shadowBlur *= scale
      },
      /**
       * @param {number} x
       * @param {number} y
       */
      shift(x, y) {
        this.x += x
        this.y += y
        shiftBounds(x, y, this.bounds)
      },
      /** @param {CanvasRenderingContext2D} ctx */
      render(ctx) {
        ctx.beginPath()

        const angleInRadians = (this.rotation * Math.PI) / 180
        const cos = Math.cos(angleInRadians)
        const sin = Math.sin(angleInRadians)

        const points = [
          {
            x: 0,
            y: 0
          },
          {
            x: Math.cos((this.angle1 * Math.PI) / 180 + Math.PI * 1.5) * this.length1,
            y: Math.sin((this.angle1 * Math.PI) / 180 + Math.PI * 1.5) * this.length1
          },
          {
            x: Math.cos((this.angle2 * Math.PI) / 180 + Math.PI * 1.5) * this.length2,
            y: Math.sin((this.angle2 * Math.PI) / 180 + Math.PI * 1.5) * this.length2
          }
        ].map(point => ({
          x: cos * point.x - sin * point.y + this.x,
          y: sin * point.x + cos * point.y + this.y
        }))

        ctx.moveTo(points[0].x, points[0].y)

        for (let i = 1; i <= points.length; i++) ctx.lineTo(points[i % points.length].x, points[i % points.length].y)
        ctxClose(ctx, this)
      }
    }
    this._renderStack.push(entry)
    return entry
  }
}

export default Glass
