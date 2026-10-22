import assert from 'node:assert/strict'
import { mkdir, writeFile, readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// Requer Vite em 5173 e um Chrome de teste com remote-debugging-port=9223.
const target = await fetch('http://127.0.0.1:9223/json/new?about:blank', { method: 'PUT' }).then(r => r.json())
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }))
let sequence = 0
const pending = new Map()
const errors = []
ws.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data)
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text)
  if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push('console.error')
  const entry = pending.get(message.id)
  if (entry) { pending.delete(message.id); message.error ? entry.reject(message.error) : entry.resolve(message.result) }
})
function send(method, params = {}) {
  return new Promise((resolve, reject) => { const id = ++sequence; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })) })
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails))
  return result.result.value
}
async function ready() {
  for (let i = 0; i < 100; i++) {
    if (await evaluate('!window.__bingoQaReload && document.querySelectorAll("button.bingo-cell").length === 16')) return
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  throw new Error('Cartela não carregou')
}
async function reload() {
  await evaluate('window.__bingoQaReload = true')
  await send('Page.reload')
  await ready()
}
async function click(selector) { await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`); await new Promise(resolve => setTimeout(resolve, 60)) }
const marked = () => evaluate('document.querySelectorAll("button.bingo-cell[aria-pressed=true]").length')
const output = 'node_modules/.tmp/bingo-qa'
await mkdir(output, { recursive: true })
const downloads = `${output}/downloads-${Date.now()}`
await mkdir(downloads, { recursive: true })
try {
  await send('Runtime.enable')
  await send('Page.enable')
  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: resolve(downloads) })
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/bingo' })
  await ready()
  assert.equal(await evaluate(`(async () => {
    const faces = await Promise.all(['400 16px Idiqlat', '400 16px Rawline', '600 16px Rawline', '700 16px Rawline'].map(spec => document.fonts.load(spec)))
    return faces.every(list => list.length > 0 && list.every(face => face.status === 'loaded'))
  })()`), true, 'Fontes locais carregadas')
  await evaluate('localStorage.clear()')
  await reload()
  assert.equal(await marked(), 0)
  await click('button.bingo-cell')
  assert.equal(await marked(), 1)
  await reload()
  assert.equal(await marked(), 1, 'Persistência após recarga')
  await click('button.bingo-cell'); assert.equal(await marked(), 0)
  await evaluate('document.querySelector("button.bingo-cell").focus()')
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 })
  await new Promise(resolve => setTimeout(resolve, 100)); assert.equal(await marked(), 1, 'Teclado Space')
  await click('input[value=blue]')
  await reload()
  assert.equal(await evaluate('document.querySelector(".bingo-page").dataset.theme'), 'blue')
  await evaluate('window.confirm = () => false; document.querySelectorAll(".actions button")[2].click()')
  assert.equal(await marked(), 1, 'Cancelar reset')
  await evaluate('window.confirm = () => true; document.querySelectorAll(".actions button")[2].click()')
  await new Promise(resolve => setTimeout(resolve, 100)); assert.equal(await marked(), 0, 'Confirmar reset')
  for (let i = 1; i <= 16; i++) await click(`button.bingo-cell:nth-child(${i})`)
  assert.equal(await marked(), 16)
  assert.match(await evaluate('document.querySelector(".progress-block").textContent'), /completou/)
  await click('button.bingo-cell'); assert.equal(await marked(), 15)
  const headingSizes = []
  for (const width of [320, 375, 768, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false })
    const headings = await evaluate(`(() => {
      const fixture = document.createElement('div')
      fixture.hidden = true
      document.body.append(fixture)
      const styles = 'h1 h2 h3 h4'.split(' ').map(name => {
        const el = document.createElement(name); el.className = name; fixture.append(el)
        const css = getComputedStyle(el)
        return { size: parseFloat(css.fontSize), weight: css.fontWeight }
      })
      fixture.remove(); return styles
    })()`)
    assert.ok(headings.every(h => h.weight === '700'), 'Utilitários h1–h4 bold')
    assert.ok(headings.every((h, i) => i === 0 || h.size < headings[i - 1].size), 'Hierarquia h1–h4')
    headingSizes.push(headings.map(h => h.size))
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, `Sem overflow ${width}`)
    assert.equal(await evaluate('[...document.querySelectorAll("button.bingo-cell")].every(e => e.scrollHeight <= e.clientHeight && e.getBoundingClientRect().width >= 44)'), true, `Células legíveis ${width}`)
    if (width === 375 || width === 1440) {
      const screenshot = await send('Page.captureScreenshot', { captureBeyondViewport: true })
      await writeFile(`${output}/interface-${width}.png`, Buffer.from(screenshot.data, 'base64'))
    }
  }
  assert.ok(headingSizes[0].every((size, i) => size < headingSizes.at(-1)[i]), 'Títulos responsivos')
  for (const theme of ['light', 'blue']) {
    await click(`input[value=${theme}]`)
    assert.equal(await evaluate('[...document.querySelectorAll(".bingo-export .bingo-cell")].every(e => e.scrollHeight <= e.clientHeight && e.lastElementChild.getBoundingClientRect().bottom <= e.getBoundingClientRect().bottom - 2)'), true, 'Conteúdo cabe nas células exportadas')
    assert.equal(await evaluate('[...document.querySelectorAll("img.cell-symbol")].every(img => img.complete && img.naturalWidth === 275 && img.naturalHeight === 299 && Math.abs(img.getBoundingClientRect().width / img.getBoundingClientRect().height - 275 / 299) < 0.01 && img.alt === "")'), true, 'Brasão original carregado, proporcional e decorativo')
    assert.deepEqual(await evaluate('(() => { const el = document.querySelector(".bingo-export"); const css = getComputedStyle(el); return [el.offsetWidth, el.offsetHeight, parseFloat(css.paddingTop), parseFloat(css.paddingBottom)] })()'), [1080, 1920, 250, 250], 'Dimensões e margens da composição')
    const shot = await send('Page.captureScreenshot', { captureBeyondViewport: true })
    await writeFile(`${output}/interface-${theme}.png`, Buffer.from(shot.data, 'base64'))
    const data = await evaluate(`(async () => {
      const { createBingoPng } = await import('/src/features/bingo/exportBingo.ts')
      const node = document.querySelector('.bingo-export')
      const blob = await createBingoPng(node)
      const bitmap = await createImageBitmap(blob)
      const bounds = node.getBoundingClientRect()
      const end = node.lastElementChild.getBoundingClientRect().bottom - bounds.top
      const base64 = await new Promise(resolve => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(',')[1]); reader.readAsDataURL(blob) })
      return { width: bitmap.width, height: bitmap.height, size: blob.size, end, base64 }
    })()`)
    assert.equal(data.width, 1080); assert.equal(data.height, 1920)
    assert.ok(data.size > 10000)
    assert.ok(data.end <= 1670, `Margem de segurança inferior: ${data.end}`)
    await writeFile(`${output}/stories-${theme}.png`, Buffer.from(data.base64, 'base64'))
    console.log(`PNG ${theme}: ${data.width}x${data.height}, ${data.size} bytes, conteúdo termina em y=${data.end}`)
  }
  await click('.actions .primary')
  let download
  for (let i = 0; i < 100; i++) {
    download = (await readdir(downloads)).find(file => file.endsWith('.png'))
    if (download) break
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  assert.ok(download, 'Download real pelo botão')
  const png = await readFile(`${downloads}/${download}`)
  assert.equal(png.readUInt32BE(16), 1080); assert.equal(png.readUInt32BE(20), 1920)
  console.log('Download pelo botão: PNG 1080x1920 confirmado no disco')
  await evaluate('localStorage.setItem("uft-parte-de-mim:bingo:v1", "{invalid")')
  await reload()
  assert.equal(await marked(), 0)
  assert.ok(await evaluate('!!document.querySelector("[role=alert]")'))
  await evaluate('Storage.prototype.setItem = () => { throw new DOMException("blocked", "SecurityError") }')
  await click('button.bingo-cell'); assert.equal(await marked(), 1)
  assert.match(await evaluate('document.querySelector("[role=alert]").textContent'), /não permitiu salvar/)
  assert.deepEqual(errors, [])
  console.log('PASS: seleção, teclado, persistência, tema, reset, conclusão, responsividade, PNG claro/azul, dados inválidos e armazenamento bloqueado. Sem exceções JS.')
} finally { ws.close() }
