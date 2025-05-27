const puppeteer = require('puppeteer')
const bun = require('bun')
const path = require('node:path')
const fs = require('node:fs')

const COLORS = {
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
}

/**
 * @param {string} name
 * @returns {Promise<boolean>}
 */
const runTest = name =>
  new Promise(async resolve => {
    const browser = await puppeteer.launch({
      channel: 'chrome',
      executablePath: `${process.env.BROWSER_PATH}/chromium`
    })

    const server = bun.serve({
      port: 3000,
      async fetch(req) {
        const url = new URL(req.url)

        if (url.pathname === '/' || url.pathname === '/index.html')
          return new Response(Bun.file(path.resolve(__dirname, './index.html')))
        if (url.pathname === '/script.js') return new Response(Bun.file(path.resolve(__dirname, './script.js')))
        if (url.pathname === '/Glass.js') return new Response(Bun.file(path.resolve(__dirname, '../Glass.js')))
        if (url.pathname === '/Color.js') return new Response(Bun.file(path.resolve(__dirname, '../Color.js')))
        if (url.pathname === '/test.js') return new Response(Bun.file(path.resolve(__dirname, 'tests', `${name}.js`)))
        if (url.pathname === '/result') {
          const result = await req.text()
          const base64Data = result.replace(/^data:image\/(png|jpeg|webp);base64,/, '')
          const imageFormat = result.match(/^data:image\/(png|jpeg|webp);base64,/)?.[1]
          const binaryData = Buffer.from(base64Data, 'base64')
          const filename = `${name}.${imageFormat}`
          if (!fs.existsSync(path.join(__dirname, 'test_target_results')))
            fs.mkdirSync(path.join(__dirname, 'test_target_results'))
          const isFirstRun = !fs.existsSync(path.join(__dirname, 'test_target_results', filename))
          const success =
            isFirstRun ||
            fs.readFileSync(path.join(__dirname, 'test_target_results', filename)).toString() === binaryData.toString()
          if (!success) {
            if (!fs.existsSync(path.join(__dirname, 'failed_test_results')))
              fs.mkdirSync(path.join(__dirname, 'failed_test_results'))
            fs.writeFileSync(path.join(__dirname, 'failed_test_results', filename), binaryData)
          }
          if (isFirstRun) fs.writeFileSync(path.join(__dirname, 'test_target_results', filename), binaryData)

          await browser.close()
          server.stop().then(() => resolve(success))
        }

        return new Response('Not Found', { status: 404 })
      }
    })

    const page = (await browser.pages())[0]

    /**
     * @param {puppeteer.ConsoleMessage} event
     * @returns {string}
     */
    const formatMessage = event => {
      const type = `[Console ${event.type()[0].toUpperCase()}${event.type().slice(1)}]`
      const trace = event
        .stackTrace()
        .map(trace =>
          trace.columnNumber
            ? `${trace.url?.replace('http://localhost:3000/', '')} ${trace.lineNumber}:${trace.columnNumber}`
            : trace.url
        )
        .join('\n')
      return `${type}: ${trace} -> ${event.text()}`
    }

    page.on('console', event => {
      if (event.type() === 'error') console.error(formatMessage(event))
      else if (event.type() === 'warn') console.warn(formatMessage(event))
      else if (event.type() === 'info') console.error(formatMessage(event))
      else console.log(formatMessage(event))
    })

    await page.setViewport({ width: 1080, height: 1024 })

    await page.goto(server.url.toString())
  })

const runTests = async () => {
  process.stdout.write('\x1b[2J\x1b[H')
  shouldRunTests = false
  isRunningTests = true
  if (fs.existsSync(path.join(__dirname, 'failed_test_results')))
    fs.rmSync(path.join(__dirname, 'failed_test_results'), { recursive: true, force: true })
  const tests = fs.readdirSync(path.join(__dirname, 'tests')).map(file => file.split('.')[0])
  let oldRemovedCount = 0
  if (fs.existsSync(path.join(__dirname, 'test_target_results')))
    for (const target of fs.readdirSync(path.join(__dirname, 'test_target_results')).map(file => file.split('.')[0]))
      if (!tests.includes(target)) {
        fs.rmSync(path.join(__dirname, 'test_target_results', `${target}.png`))
        oldRemovedCount++
      }
  if (oldRemovedCount)
    console.log(`${COLORS.yellow}Removed ${oldRemovedCount} old test${oldRemovedCount === 1 ? '' : 's'}`)
  console.log(`${COLORS.green}Running ${tests.length} test${tests.length === 1 ? '' : 's'}...`)
  /** @type {Object<string, boolean>} */
  const results = {}
  const allStartTime = Date.now()
  let index = 0
  for await (const name of tests) {
    const start = Date.now()
    const result = await runTest(name)
    results[name] = result
    console.log(
      `${result ? COLORS.green : COLORS.red} * (${index + 1}/${tests.length}) test "${name}" ${result ? 'passed' : 'failed'} in ${Date.now() - start} ms`
    )
    index++
  }
  const successCount = Object.values(results).reduce((prev, bool) => prev + (bool ? 1 : 0), 0)
  const failCount = Object.values(results).reduce((prev, bool) => prev + (bool ? 0 : 1), 0)
  if (failCount)
    console.log(
      `${COLORS.yellow}${successCount} test${successCount === 1 ? '' : 's'} passed, ${COLORS.red}${failCount} test${failCount === 1 ? '' : 's'} failed`
    )
  else console.log(`${COLORS.green}All tests passed`)
  console.log(
    `${failCount ? (successCount ? COLORS.yellow : COLORS.red) : COLORS.green}${tests.length} test${tests.length === 1 ? '' : 's'} ran in ${Date.now() - allStartTime} ms`
  )
  if (shouldRunTests) await runTests()
  isRunningTests = false
}

let shouldRunTests = false
let isRunningTests = false
/**
 * @param {string} mode
 */
const watchCallback = mode => {
  if (mode !== 'change') return
  shouldRunTests = true
  if (!isRunningTests) runTests()
}
if (process.argv[2] === 'watch') {
  fs.watch(path.join(__dirname, 'tests'), { persistent: true, recursive: true }, watchCallback)
  fs.watch(path.join(__dirname, '..', 'Glass.js'), { persistent: true }, watchCallback)
}
runTests()
