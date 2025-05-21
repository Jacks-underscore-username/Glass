//TODO: bug when color is set using HEXA

/**
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const clamp = (val, min, max) => Math.min(max, Math.max(min, val))

/**
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @returns {number}
 */
const lerp = (a, b, t) => a + t * (b - a)

/**
 * @typedef {object} RGB
 * @property {number} red
 * @property {number} green
 * @property {number} blue
 * @property {number} alpha
 */

/**
 * @typedef {object} HSL
 * @property {number} hue
 * @property {number} saturation
 * @property {number} lightness
 * @property {number} alpha
 */

class Color {
  /**
   * @param {RGB} rgb - The RGB color object.
   * @param {boolean} [forceFullLength=false]
   * @returns {string}
   */
  static rgbToHex(rgb, forceFullLength = false) {
    const red = clamp(Math.round(rgb.red), 0, 255)
    const green = clamp(Math.round(rgb.green), 0, 255)
    const blue = clamp(Math.round(rgb.blue), 0, 255)
    const alpha = clamp(Math.round(((rgb.alpha ?? 100) * 255) / 100), 0, 255)

    const redHex = red.toString(16).slice(0, 2)
    const greenHex = green.toString(16).slice(0, 2)
    const blueHex = blue.toString(16).slice(0, 2)
    const alphaHex = alpha.toString(16).slice(0, 2)

    if (redHex.length > 2 || greenHex.length > 2 || blueHex.length > 2 || alphaHex.length > 2) throw new Error('Uh oh')

    const maxLength = Math.max(redHex.length, greenHex.length, blueHex.length, alphaHex.length, forceFullLength ? 2 : 1)
    const hex = `#${redHex.padStart(maxLength, '0')}${greenHex.padStart(maxLength, '0')}${blueHex.padStart(maxLength, '0')}${alphaHex.padStart(maxLength, '0')}`
    if (![4, 5, 7, 9].includes(hex.length)) throw new Error("That's not good")
    return hex
  }

  /**
   * @param {RGB} rgb - The RGB color object.
   * @returns {HSL}
   */
  static rgbToHsl(rgb) {
    let r = clamp(Math.round(rgb.red), 0, 255)
    let g = clamp(Math.round(rgb.green), 0, 255)
    let b = clamp(Math.round(rgb.blue), 0, 255)
    const a = clamp(Math.round(rgb.alpha ?? 100), 0, 100)

    r /= 255
    g /= 255
    b /= 255
    const l = Math.max(r, g, b)
    const s = l - Math.min(r, g, b)
    const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0

    return {
      hue: 60 * h < 0 ? 60 * h + 360 : 60 * h,
      saturation: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
      lightness: (100 * (2 * l - s)) / 2,
      alpha: a
    }
  }

  /**
   * @param {string} hex - The HEX color string.
   * @returns {RGB}
   */
  static hexToRgb(hex) {
    if (hex[0] === '#') hex = hex.slice(1)
    let red, green, blue
    let alpha = 100

    if (hex.length === 3) {
      red = Number.parseInt(`${hex[0]}${hex[0]}`, 16)
      green = Number.parseInt(`${hex[1]}${hex[1]}`, 16)
      blue = Number.parseInt(`${hex[2]}${hex[2]}`, 16)
    } else if (hex.length === 4) {
      red = Number.parseInt(`${hex[0]}${hex[0]}`, 16)
      green = Number.parseInt(`${hex[1]}${hex[1]}`, 16)
      blue = Number.parseInt(`${hex[2]}${hex[2]}`, 16)
      alpha = Math.round((Number.parseInt(`${hex[3]}${hex[3]}`, 16) * 100) / 256)
    } else if (hex.length === 6) {
      red = Number.parseInt(hex.slice(0, 2), 16)
      green = Number.parseInt(hex.slice(2, 4), 16)
      blue = Number.parseInt(hex.slice(4, 6), 16)
    } else if (hex.length === 8) {
      red = Number.parseInt(hex.slice(0, 2), 16)
      green = Number.parseInt(hex.slice(2, 4), 16)
      blue = Number.parseInt(hex.slice(4, 6), 16)
      alpha = Math.round((Number.parseInt(hex.slice(6), 16) * 100) / 256)
    } else throw new Error('Somethings wrong, I can feel it...')

    return { red, green, blue, alpha }
  }

  /**
   * @param {string} hex - The HEX color string.
   * @returns {HSL}
   */
  static hexToHsl(hex) {
    return Color.rgbToHsl(Color.hexToRgb(hex))
  }

  /**
   * @param {HSL} hsl - The HSL color object.
   * @returns {RGB}
   */
  static hslToRgb(hsl) {
    let h = hsl.hue
    h %= 360
    if (h < 0) h += 360
    let s = clamp(hsl.saturation, 0, 100)
    let l = clamp(hsl.lightness, 0, 100)
    const alpha = clamp(hsl.alpha ?? 255, 0, 100)

    s /= 100
    l /= 100
    const k = (/** @type {number} */ n) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (/** @type {number} */ n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))

    return {
      red: Math.round(255 * f(0)),
      green: Math.round(255 * f(8)),
      blue: Math.round(255 * f(4)),
      alpha
    }
  }

  /**
   * @param {HSL} hsl - The HSL color object.
   * @returns {string}
   */
  static hslToHex(hsl) {
    return Color.rgbToHex(Color.hslToRgb(hsl))
  }

  /**
   * @param {string} [hex]
   */
  constructor(hex) {
    if (hex) {
      this._hex = hex[0] === '#' ? hex : `#${hex}`
      this.update('hex')
    }
  }

  /**
   *
   * @param {"rgb" | "hsl" | "alpha" | "hex"} mode
   */
  update(mode) {
    if (mode === 'rgb') {
      ;({
        hue: this._h,
        saturation: this._s,
        lightness: this._l
      } = Color.rgbToHsl({ red: this._r, green: this._g, blue: this._b, alpha: this._a }))
      this._hex = Color.rgbToHex({
        red: this._r,
        green: this._g,
        blue: this._b,
        alpha: this._a
      })
    } else if (mode === 'hsl') {
      ;({
        red: this._r,
        green: this._g,
        blue: this._b
      } = Color.hslToRgb({ hue: this._h, saturation: this._s, lightness: this._l, alpha: this._a }))
      this._hex = Color.rgbToHex({
        red: this._r,
        green: this._g,
        blue: this._b,
        alpha: this._a
      })
    } else if (mode === 'alpha')
      this._hex = Color.rgbToHex({
        red: this._r,
        green: this._g,
        blue: this._b,
        alpha: this._a
      })
    else if (mode === 'hex') {
      ;({ red: this._r, green: this._g, blue: this._b, alpha: this._a } = Color.hexToRgb(this._hex))
      ;({
        hue: this._h,
        saturation: this._s,
        lightness: this._l
      } = Color.rgbToHsl({ red: this._r, green: this._g, blue: this._b, alpha: this._a }))
    }
  }

  /**
   * Lerps from one color to another and returns a new color instance with the result
   * @param {Color} otherColor
   * @param {number} t
   * @returns {Color}
   */
  lerp(otherColor, t) {
    const red = Math.round(lerp(this.red, otherColor.red, t))
    const green = Math.round(lerp(this.green, otherColor.green, t))
    const blue = Math.round(lerp(this.blue, otherColor.blue, t))
    const alpha = Math.round(lerp(this.alpha, otherColor.alpha, t))
    const newColor = new Color()
    newColor.red = red
    newColor.green = green
    newColor.blue = blue
    newColor.alpha = alpha
    return newColor
  }

  _r = 0
  _g = 0
  _b = 0
  _a = 100
  _h = 0
  _s = 0
  _l = 0
  _hex = '#000'

  get r() {
    return this._r
  }
  get red() {
    return this._r
  }
  get g() {
    return this._g
  }
  get green() {
    return this._g
  }
  get b() {
    return this._b
  }
  get blue() {
    return this._b
  }
  get rgb() {
    return {
      red: this._r,
      green: this._g,
      blue: this._b,
      ...(this._a !== 100 ? { alpha: this._a } : {})
    }
  }
  get a() {
    return this._a
  }
  get alpha() {
    return this._a
  }
  get h() {
    return this._h
  }
  get hue() {
    return this._h
  }
  get s() {
    return this._s
  }
  get saturation() {
    return this._s
  }
  get l() {
    return this._l
  }
  get lightness() {
    return this._l
  }
  get hsl() {
    return {
      hue: this._h,
      saturation: this._s,
      lightness: this._l,
      ...(this._a !== 100 ? { alpha: this._a } : {})
    }
  }
  get hex() {
    return this._hex
  }

  set r(value) {
    this._r = value
    this.update('rgb')
  }
  set red(value) {
    this._r = value
    this.update('rgb')
  }
  set g(value) {
    this._g = value
    this.update('rgb')
  }
  set green(value) {
    this._g = value
    this.update('rgb')
  }
  set b(value) {
    this._b = value
    this.update('rgb')
  }
  set blue(value) {
    this._b = value
    this.update('rgb')
  }
  set rgb(value) {
    // @ts-ignore
    this._r = value.r ?? value.red
    // @ts-ignore
    this._g = value.g ?? value.green
    // @ts-ignore
    this._b = value.b ?? value.blue
    // @ts-ignore
    this._a = value.a ?? value.alpha ?? this._a
    this.update('rgb')
  }
  set a(value) {
    this._a = value
    this.update('alpha')
  }
  set alpha(value) {
    this._a = value
    this.update('alpha')
  }
  set h(value) {
    this._h = value
    this.update('hsl')
  }
  set hue(value) {
    this._h = value
    this.update('hsl')
  }
  set s(value) {
    this._s = value
    this.update('hsl')
  }
  set saturation(value) {
    this._s = value
    this.update('hsl')
  }
  set l(value) {
    this._l = value
    this.update('hsl')
  }
  set lightness(value) {
    this._l = value
    this.update('hsl')
  }
  set hsl(value) {
    // @ts-ignore
    this._h = value.h ?? value.hue
    // @ts-ignore
    this._s = value.s ?? value.saturation
    // @ts-ignore
    this._l = value.l ?? value.lightness
    // @ts-ignore
    this._a = value.a ?? value.alpha ?? this._a
    this.update('hsl')
  }
  set hex(value) {
    this._hex = value
    this.update('hex')
  }
}

export default Color
