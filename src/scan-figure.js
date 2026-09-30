// Animates the hero's illustrative surgical-video figure: one frame, slowed
// down, passing through a computer-vision pipeline. Over the loop, a grasper
// reaches for the tissue, grips it, and retracts it, while the six steps under
// the frame run. The film strip delivers a new frame, which is read as pixels,
// encoded as patch features, and segmented. Its instrument is boxed and
// tracked, the surgical phase and action are recognized from recent frames,
// and a reviewer confirms each result before the grasper lets go.
// The steps are buttons that jump to their stage, or with reduced motion switch
// between stills. Without JavaScript the figure keeps its segmentation still.

const WIDTH = 480
const HEIGHT = 408
const FRAME_HEIGHT = 360
const VIEW = { x: 240, y: 180, r: 212 }
const PIXEL = 8
const CELL = 24
const PATCH = 12
const BAND = PATCH * 5
const TOOL_COLOR = '#7de0d2'
const TISSUE_COLOR = '#9cc4f5'
const SVG_NS = 'http://www.w3.org/2000/svg'

// Loop timings, in seconds. STAGES line up with the steps under the figure,
// and STILLS holds a finished moment of each, shown when a step is chosen
// while paused or with reduced motion. Fades are [in, in end, out, out end].
const CYCLE = 31
const STAGES = [[0, 4.5], [4.5, 9.5], [9.5, 14.5], [14.5, 19.5], [19.5, 24.5], [24.5, 31]]
const STILLS = [3.6, 8.6, 14, 18.4, 23.6, 28.8]
// The markup shows the segmentation still.
const MARKUP_STAGE = 2

// 1. Capture: the last frame's results clear as the strip advances. The new
//    frame flashes in, and a probe reads single pixels off a pixel grid.
const CLEAR = [0, 0.5]
const SLIDE = [0.1, 0.8]
const FLASH = [0.8, 1.3]
const LOCK = [0.55, 1.15]
const PIXELS = [1.1, 1.6, 4.3, 4.9]
const PROBES = [1.8, 2.6, 3.4, 4.2]
// 2. Features: a patch grid, then patches light up in reading order.
const CELLS = [4.5, 5, 9.2, 9.8]
const READ = [5, 7.6]
// 3. Segmentation: a scan classifies patches and reveals the outlines.
const SWEEP = [9.8, 12]
const SWEEP_FADE = [9.7, 9.85, 12, 12.25]
const LABELS_ON = 12.1
// 4. Tracking: the outlines dim, and a box follows the instrument tip.
const DIM = [14.5, 15]
const TRACK = [14.9, 15.4, 19, 19.5]
const TRAIL = { start: 15, step: 0.2, dots: 16 }
// 5. Phase: a window of recent frames gives the newest frame its phase, and
//    the action is named beside the jaws.
const WINDOW = [19.7, 20.7, 24.1, 24.6]
const PHASE_FILL = [20.8, 21.4]
const PHASE_ON = 21.3
// 6. Review: the outlines return, and a reviewer confirms each result.
const UNDIM = [24.5, 25]
const REVIEW_ON = 24.6
const CURSOR = [24.8, 25.1, 29.2, 29.6]
const CURSOR_LEGS = [[25, 25.7], [26.1, 26.9], [27.3, 28.1], [28.6, 29.6]]
const CLICKS = [25.8, 27, 28.2]
const RIPPLE = 0.6
const TIMECODE_START = 872.4

// Resting poses match the markup. Points on a part are in its own coordinates.
const TOOL = { x: 262, y: 200, angle: -33, scale: 1 }
const TISSUE = { x: 150, y: 258, angle: -10, scale: 1 }
const TOOL_LABEL_CORNER = [150, -11.5]
const TISSUE_LABEL_CORNER = [-25, -46]
const TOOL_TIP = [1, 0]
const TOOL_BOX = [[-4, -19], [-4, 19], [58, -15], [58, 15]]
const TOOL_CLICK = [96, 0]
const TISSUE_CLICK = [-6, 6]
// Inside the phase label at any figure width.
const PHASE_CLICK = { x: 384, y: 331 }
const CURSOR_ENTRY = { x: 312, y: 316 }
const CURSOR_EXIT = { x: 344, y: 290 }
// The pixels the probe reads, with roughly the colors drawn there.
const PROBE_POINTS = [
  { part: 'tissue', at: [-34, -8], rgb: '70 137 146' },
  { at: { x: 332, y: 150 }, rgb: '31 76 90' },
  { part: 'tool', at: [150, 0], rgb: '178 196 203' },
]
// Laparoscopic tools pivot where they enter the body, so the tip sweeps an arc
// around a point far outside the frame while the shaft slides in and out.
const PORT_DISTANCE = 700
// The grasper's action as [time, turn, slide, jaw opening] keyframes, eased
// between. Turn is degrees about the port, slide is how far the shaft has
// moved in, and an opening of 1 matches the drawn jaws. It reaches for the
// tissue's lobe with jaws open, grips and retracts it, pulls again while
// tracked, holds through phase recognition and review, then lets go.
const ACTION = [
  [0, 0, 0, 1],
  [1.2, 0, 0, 1],
  [4.2, -0.75, 80, 1.4],
  [4.8, -0.75, 80, 1.4],
  [5.4, -0.75, 80, 0.3],
  [8, -0.2, 60, 0.3],
  [15, -0.2, 60, 0.3],
  [18.5, 0.4, 50, 0.3],
  [29, 0.4, 50, 0.3],
  [29.6, 0.4, 54, 1.4],
  [31, 0, 0, 1],
]
// The tissue follows the jaws while they grip, then springs back after RELEASE.
const GRIP = [5, 5.4]
const RELEASE = 29
// Where the jaws hold tissue on the tool, and the point on the tissue's lobe they hold.
const BITE = [8, 0]
const GRASP = [58, 0]
// How far the pull spreads through the tissue, and the lobe's axis for the patch classifier.
const PULL_SPREAD = 30
const LOBE = [[40, 0], [72, 0]]
// The jaws pivot on the pin, turning JAW_SWING degrees per unit of opening.
const JAW_HINGE = [41, 0]
const JAW_SWING = 17
// The tissue outline as a start point and cubic segments, as in the markup.
const TISSUE_OUTLINE = [
  [-80, 2], [-80, -30], [-55, -48], [-25, -46], [5, -44], [35, -30], [58, -22], [72, -17], [80, -8], [78, 2],
  [76, 12], [66, 18], [54, 20], [30, 26], [5, 44], [-25, 46], [-58, 48], [-80, 34], [-80, 2],
]
// The upper jaw's part of the instrument outline: outer tip, curve control,
// curve end, and inner tip. The lower jaw mirrors it.
const JAW_OUTLINE = [[6, -17], [-3.5, -16.5], [-1, -9], [1.5, -6]]

// The film strip holds SLOTS thumbnails STEP apart, with the newest under the
// notch. It advances one slot per loop, so each loop is the next frame.
const SLOTS = 12
const STEP = 40
const FILM_Y = 370
const WINDOW_SLOTS = 6
// Thumbnail tools pivot around the port too, in thumbnail coordinates.
const FILM_PIVOT = '63.7 -13.6'
// Phase colors and opacities. Frames before EARLIER_PHASE_UNTIL belong to the earlier phase.
const PHASE_COLORS = [[TISSUE_COLOR, 0.5], [TOOL_COLOR, 0.75]]
const EARLIER_PHASE_UNTIL = -6

const clamp = (value) => Math.min(1, Math.max(0, value))
const ramp = (t, [start, end]) => clamp((t - start) / (end - start))
const fade = (t, [inStart, inEnd, outStart, outEnd]) => ramp(t, [inStart, inEnd]) * (1 - ramp(t, [outStart, outEnd]))
const ease = (u) => (1 - Math.cos(Math.PI * u)) / 2
const within = (t, [start, end]) => t >= start && t < end
const rad = (degrees) => (degrees * Math.PI) / 180
const percent = (value) => `${(value * 100).toFixed(3)}%`
const lerp = (from, to, u) => ({ x: from.x + (to.x - from.x) * u, y: from.y + (to.y - from.y) * u })
const fract = (value) => value - Math.floor(value)

function actionAt(t) {
  let i = 0
  while (i < ACTION.length - 2 && t >= ACTION[i + 1][0]) i++
  const [start, ...from] = ACTION[i]
  const [end, ...to] = ACTION[i + 1]
  const u = ease(ramp(t, [start, end]))
  const [turn, slide, open] = from.map((value, k) => value + (to[k] - value) * u)
  return { turn, slide, open }
}

// The tool's pose at loop time t, with a slight sway of the hand on the clock.
function toolPose(t, time) {
  const { turn, slide, open } = actionAt(t)
  const angle = TOOL.angle + turn + 0.5 * Math.sin(time * 0.9) + 0.2 * Math.sin(time * 2.3)
  const reach = PORT_DISTANCE + slide + 4 * Math.sin(time * 1.4)
  const rest = rad(TOOL.angle)
  return {
    x: TOOL.x + PORT_DISTANCE * Math.cos(rest) - reach * Math.cos(rad(angle)),
    y: TOOL.y + PORT_DISTANCE * Math.sin(rest) - reach * Math.sin(rad(angle)),
    angle,
    scale: 1,
    open,
  }
}

// The tissue rises and swells slightly with a four-second breath.
function tissuePose(time) {
  const breath = Math.sin((time * Math.PI) / 2)
  return { ...TISSUE, y: TISSUE.y - 1.5 * breath, scale: 1 + 0.015 * breath }
}

function toWorld(pose, [x, y]) {
  const a = rad(pose.angle)
  const sx = x * pose.scale
  const sy = y * pose.scale
  return { x: pose.x + sx * Math.cos(a) - sy * Math.sin(a), y: pose.y + sx * Math.sin(a) + sy * Math.cos(a) }
}

function toLocal(pose, x, y) {
  const a = rad(-pose.angle)
  const dx = x - pose.x
  const dy = y - pose.y
  return {
    x: (dx * Math.cos(a) - dy * Math.sin(a)) / pose.scale,
    y: (dx * Math.sin(a) + dy * Math.cos(a)) / pose.scale,
  }
}

// How far the gripped point of the tissue is pulled, in the tissue's own
// coordinates. It follows the jaws while they grip, then springs back.
function tissuePull(t, time, tissue) {
  if (t < GRIP[0]) return { x: 0, y: 0 }
  const bite = toWorld(toolPose(Math.min(t, RELEASE), time), BITE)
  const held = toLocal(tissue, bite.x, bite.y)
  const since = t - RELEASE
  const strength = t < RELEASE ? ease(ramp(t, GRIP)) : Math.exp(-6 * since) * Math.cos(14 * since)
  return { x: (held.x - GRASP[0]) * strength, y: (held.y - GRASP[1]) * strength }
}

// Moves a point of the tissue with the pull, less the further it is from the grip.
function pulled([x, y], pull) {
  const weight = Math.exp(-((x - GRASP[0]) ** 2 + (y - GRASP[1]) ** 2) / (2 * PULL_SPREAD ** 2))
  return [x + pull.x * weight, y + pull.y * weight]
}

// The tissue outline, stretched toward the jaws.
function tissueOutline(pull) {
  const points = TISSUE_OUTLINE.map((point) => pulled(point, pull).map((value) => value.toFixed(2)).join(' '))
  let d = `M${points[0]}`
  for (let i = 1; i < points.length; i += 3) d += `C${points[i]} ${points[i + 1]} ${points[i + 2]}`
  return `${d}Z`
}

const jawAngle = (open) => (open - 1) * JAW_SWING

function rotateAbout([x, y], [cx, cy], degrees) {
  const a = rad(degrees)
  return [cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)]
}

// The instrument outline with its jaws at the given opening. The inner tips
// stop at the axis, so a closed outline doesn't cross itself.
function toolOutline(open) {
  const [tip, control, end, inner] = JAW_OUTLINE.map((point) => rotateAbout(point, JAW_HINGE, jawAngle(open)))
  inner[1] = Math.min(inner[1], 0)
  const upper = ([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`
  const lower = ([x, y]) => `${x.toFixed(2)} ${(-y).toFixed(2)}`
  return `M446-11.5H54L51-13H31L${upper(tip)}Q${upper(control)} ${upper(end)}L${upper(inner)}L29 0`
    + `L${lower(inner)}L${lower(end)}Q${lower(control)} ${lower(tip)}L31 13H51L54 11.5H446Z`
}

function distanceToSegment({ x, y }, [ax, ay], [bx, by]) {
  const dx = bx - ax
  const dy = by - ay
  const u = clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy))
  return Math.hypot(x - ax - u * dx, y - ay - u * dy)
}

// Whether a point in tissue coordinates falls on the lobe as the pull moves it.
const onLobe = (point, pull) => distanceToSegment(point, pulled(LOBE[0], pull), pulled(LOBE[1], pull)) < 16

function transformOf({ x, y, angle, scale }) {
  const scaled = scale === 1 ? '' : ` scale(${scale.toFixed(4)})`
  return `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${angle.toFixed(3)})${scaled}`
}

// A coarse stand-in for a model's patch classifier: the shaft is a band around
// the tool's axis, and the tissue is close to an ellipse plus its pulled lobe.
function patchColor(x, y, tool, tissue, pull) {
  const onTool = toLocal(tool, x, y)
  if (onTool.x > -3 && Math.abs(onTool.y) < 11) return TOOL_COLOR
  const onTissue = toLocal(tissue, x, y)
  if (((onTissue.x + 2) / 80) ** 2 + (onTissue.y / 42) ** 2 < 1 || onLobe(onTissue, pull)) return TISSUE_COLOR
  return null
}

// A stand-in for patch feature strength: highest at the instrument tip, strong
// along the shaft, moderate over the tissue, and faint texture elsewhere.
function featureStrength(x, y, tool, tissue, pull, noise) {
  const onTool = toLocal(tool, x, y)
  const shaft = onTool.x > -8 ? 1 - clamp((Math.abs(onTool.y) - 8) / 16) : 0
  const tip = 1 - clamp(Math.hypot(onTool.x - 18, onTool.y) / 52)
  const onTissue = toLocal(tissue, x, y)
  const radius = Math.hypot((onTissue.x + 2) / 80, onTissue.y / 44)
  const blob = radius < 1 ? 0.4 + 0.3 * radius : 0.7 * (1 - clamp((radius - 1) * 4))
  const lobe = onLobe(onTissue, pull) ? 0.6 : 0
  return Math.max(0.85 * shaft, tip, blob, lobe, 0.02 + 0.12 * noise)
}

// Each thumbnail's tool sits at a slightly different angle, as in a real sequence.
const filmAngle = (index) => 3 * Math.sin(index * 2.1) + 1.5 * Math.sin(index * 0.7)

function timecode(time) {
  const frames = Math.floor((time + TIMECODE_START) * 25)
  const seconds = Math.floor(frames / 25)
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60, frames % 25]
    .map((part) => String(part).padStart(2, '0'))
    .join(':')
}

function svgElement(name, attributes) {
  const element = document.createElementNS(SVG_NS, name)
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
  return element
}

export function initScanFigure() {
  const figure = document.querySelector('.intelligence-figure')
  const toggle = figure?.querySelector('.scan-toggle')
  if (!figure || !toggle) return

  const find = (selector) => figure.querySelector(selector)
  const tools = figure.querySelectorAll('.scan-tool')
  const tissues = figure.querySelectorAll('.scan-tissue')
  const tissueShapes = figure.querySelectorAll('.scan-tissue-shape')
  const jaws = figure.querySelectorAll('.scan-jaw')
  const toolOutlinePath = find('.scan-tool-outline')
  const masks = find('.scan-masks')
  const reveal = find('.scan-reveal')
  const sweep = find('.scan-sweep')
  const band = find('.scan-band')
  const glow = find('.scan-glow')
  const line = find('.scan-line')
  const flash = find('.scan-flash')
  const cornerMarks = find('.scan-corners')
  const pixels = find('.scan-pixels')
  const probe = find('.scan-probe')
  const probeValue = find('.probe-value')
  const cellGrid = find('.scan-cells')
  const heat = find('.scan-heat')
  const readHead = find('.scan-read')
  const track = find('.scan-track')
  const path = find('.scan-path')
  const box = find('.scan-box')
  const tip = find('.scan-tip')
  const ripple = find('.scan-ripple')
  const clock = find('.scan-timecode')
  const filmWindow = find('.film-window')
  const cursor = find('.scan-cursor')
  const labels = {
    tool: find('.label-instrument'),
    tissue: find('.label-tissue'),
    probe: find('.label-probe'),
    track: find('.label-track'),
    action: find('.label-action'),
    phase: find('.label-phase'),
  }
  const steps = [...figure.querySelectorAll('.pipeline-steps button')]
  const details = [...figure.querySelectorAll('.pipeline-detail')]

  const patchLayer = find('.scan-patches')
  const patches = Array.from({ length: 64 }, () => {
    const patch = svgElement('rect', { width: PATCH - 3, height: PATCH - 3, display: 'none' })
    patchLayer.append(patch)
    return patch
  })
  let patchesShown = 0

  // Feature cells cover the scope's view, in reading order.
  const cells = []
  for (let row = 0; row < FRAME_HEIGHT / CELL; row++) {
    for (let col = 0; col < WIDTH / CELL; col++) {
      const x = col * CELL + CELL / 2
      const y = row * CELL + CELL / 2
      if (Math.hypot(x - VIEW.x, y - VIEW.y) > VIEW.r) continue
      const rect = svgElement('rect', {
        x: col * CELL + 1.5, y: row * CELL + 1.5, width: CELL - 3, height: CELL - 3, rx: 2, fill: TOOL_COLOR, 'fill-opacity': 0,
      })
      heat.append(rect)
      cells.push({ rect, x, y, noise: fract(Math.sin(col * 12.99 + row * 78.23) * 43758.55) })
    }
  }

  const trailLayer = find('.scan-trail')
  const trail = Array.from({ length: TRAIL.dots }, (_, i) => {
    const dot = svgElement('circle', { r: (2.8 - i * 0.1).toFixed(2), 'fill-opacity': (0.95 * (1 - i / TRAIL.dots)).toFixed(2) })
    trailLayer.append(dot)
    return dot
  })

  // One more thumbnail than slots, so a frame can slide out as the next slides in.
  const template = find('#film-frame')
  const film = Array.from({ length: SLOTS + 1 }, () => {
    const frame = template.cloneNode(true)
    frame.removeAttribute('id')
    const bar = svgElement('rect', { x: -2, y: 31, width: STEP, height: 3 })
    frame.append(bar)
    return { frame, tool: frame.querySelector('.film-tool'), marks: frame.querySelectorAll('.film-mark'), bar }
  })
  find('.film-frames').replaceChildren(...film.map(({ frame }) => frame))

  function hidePatches(from = 0) {
    for (let i = from; i < patchesShown; i++) patches[i].setAttribute('display', 'none')
    patchesShown = from
  }

  // Lights the patches in the band behind the scan line that fall on a part.
  function drawPatches(scanX, tool, tissue, pull) {
    let shown = 0
    const lastCol = Math.floor((scanX - PATCH / 2) / PATCH)
    for (let col = lastCol - BAND / PATCH + 1; col <= lastCol; col++) {
      const cx = col * PATCH + PATCH / 2
      const fadeOut = 1 - (scanX - cx) / BAND
      for (let row = 0; row < FRAME_HEIGHT / PATCH && shown < patches.length; row++) {
        const cy = row * PATCH + PATCH / 2
        if (Math.hypot(cx - VIEW.x, cy - VIEW.y) > VIEW.r) continue
        const color = patchColor(cx, cy, tool, tissue, pull)
        if (!color) continue
        const patch = patches[shown++]
        patch.setAttribute('x', col * PATCH + 2)
        patch.setAttribute('y', row * PATCH + 2)
        patch.setAttribute('fill', color)
        patch.setAttribute('fill-opacity', (0.65 * fadeOut).toFixed(2))
        patch.removeAttribute('display')
      }
    }
    patchesShown = Math.max(patchesShown, shown)
    hidePatches(shown)
  }

  // Step 1: the frame flashes in, the corner marks lock on, and a probe reads
  // single pixels off the pixel grid.
  function drawCapture(t, tool, tissue) {
    flash.setAttribute('opacity', within(t, FLASH) ? (0.18 * (1 - ramp(t, FLASH))).toFixed(3) : 0)
    const lock = 1 + 0.03 * Math.sin(Math.PI * ramp(t, LOCK))
    cornerMarks.setAttribute('transform', `translate(240 180) scale(${lock.toFixed(4)}) translate(-240 -180)`)
    clock.classList.toggle('is-bright', within(t, STAGES[0]))
    pixels.setAttribute('opacity', fade(t, PIXELS).toFixed(3))

    const hop = PROBES.findIndex((start, i) => i < PROBES.length - 1 && within(t, [start, PROBES[i + 1]]))
    probe.setAttribute('opacity', hop < 0 ? 0 : 1)
    labels.probe.classList.toggle('is-visible', hop >= 0)
    if (hop < 0) return

    const { part, at, rgb } = PROBE_POINTS[hop]
    const point = part === 'tool' ? toWorld(tool, at) : part === 'tissue' ? toWorld(tissue, at) : at
    const x = Math.floor(point.x / PIXEL) * PIXEL
    const y = Math.floor(point.y / PIXEL) * PIXEL
    probe.setAttribute('x', x)
    probe.setAttribute('y', y)
    if (probeValue.textContent !== rgb) probeValue.textContent = rgb
    // The readout sits above the pixel, on the side toward the middle of the frame.
    const leftSide = x > VIEW.x
    labels.probe.style.left = leftSide ? '' : percent((x + PIXEL + 4) / WIDTH)
    labels.probe.style.right = leftSide ? percent(1 - (x - 4) / WIDTH) : ''
    labels.probe.style.bottom = percent(1 - (y - 4) / HEIGHT)
    labels.probe.style.transformOrigin = leftSide ? '100% 100%' : '0 100%'
  }

  // Step 2: patches light up in reading order with the strength of their features.
  function drawFeatures(t, tool, tissue, pull) {
    const opacity = fade(t, CELLS)
    cellGrid.setAttribute('opacity', opacity.toFixed(3))
    heat.setAttribute('opacity', opacity.toFixed(3))
    const reading = within(t, READ)
    readHead.setAttribute('opacity', reading ? 1 : 0)
    if (!opacity) return

    const read = Math.floor(ramp(t, READ) * cells.length)
    cells.forEach((cell, i) => {
      const strength = i < read ? 0.04 + 0.66 * featureStrength(cell.x, cell.y, tool, tissue, pull, cell.noise) : 0
      cell.rect.setAttribute('fill-opacity', strength.toFixed(2))
    })
    if (reading && read < cells.length) {
      readHead.setAttribute('x', cells[read].x - CELL / 2)
      readHead.setAttribute('y', cells[read].y - CELL / 2)
    }
  }

  // Step 3: the scan reveals the outlines behind it as it crosses the frame.
  // The outlines clear with the last frame, dim while tracking and phase take
  // over, and return for review.
  function drawSegmentation(t, tool, tissue, pull) {
    const scanX = 20 + 450 * ease(ramp(t, SWEEP))
    const sweepOpacity = fade(t, SWEEP_FADE)
    sweep.setAttribute('opacity', sweepOpacity.toFixed(3))
    band.setAttribute('x', (scanX - BAND).toFixed(2))
    glow.setAttribute('x', (scanX - 40).toFixed(2))
    line.setAttribute('x', (scanX - 1).toFixed(2))
    if (sweepOpacity) drawPatches(scanX, tool, tissue, pull)
    else hidePatches()

    reveal.setAttribute('width', t < CLEAR[1] ? WIDTH : t < SWEEP[0] ? 0 : t < SWEEP[1] ? scanX.toFixed(2) : WIDTH)
    const opacity = t < STAGES[2][0] ? 1 - ramp(t, CLEAR) : 1 - 0.65 * ramp(t, DIM) + 0.65 * ramp(t, UNDIM)
    masks.setAttribute('opacity', opacity.toFixed(3))

    // Label corners stay on their moving outlines.
    const toolCorner = toWorld(tool, TOOL_LABEL_CORNER)
    const tissueCorner = toWorld(tissue, TISSUE_LABEL_CORNER)
    labels.tool.style.right = percent(1 - toolCorner.x / WIDTH)
    labels.tool.style.bottom = percent(1 - toolCorner.y / HEIGHT)
    labels.tissue.style.left = percent(tissueCorner.x / WIDTH)
    labels.tissue.style.bottom = percent(1 - tissueCorner.y / HEIGHT)
    const labeled = within(t, [LABELS_ON, DIM[0]]) || t >= REVIEW_ON
    labels.tool.classList.toggle('is-visible', labeled)
    labels.tissue.classList.toggle('is-visible', labeled)
    labels.tool.classList.toggle('is-reviewed', t >= CLICKS[0])
    labels.tissue.classList.toggle('is-reviewed', t >= CLICKS[1])
  }

  // Step 4: a box closes in on the instrument tip, which leaves a trail of its
  // recent positions.
  function drawTracking(t, tool, clockTime) {
    const opacity = fade(t, TRACK)
    track.setAttribute('opacity', opacity.toFixed(3))
    labels.track.classList.toggle('is-visible', within(t, [TRACK[1], TRACK[2]]))
    if (!opacity) return

    const pad = 5 + 12 * (1 - ease(ramp(t, [TRACK[0], TRACK[1]])))
    const points = TOOL_BOX.map((point) => toWorld(tool, point))
    const xs = points.map(({ x }) => x)
    const ys = points.map(({ y }) => y)
    const [x0, y0, x1, y1] = [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) + pad, Math.max(...ys) + pad]
    // Each corner is drawn as an L with arms pointing into the box.
    const arm = 10
    box.setAttribute('d', [[x0, y0, 1, 1], [x1, y0, -1, 1], [x1, y1, -1, -1], [x0, y1, 1, -1]]
      .map(([x, y, dx, dy]) => `M${x.toFixed(1)} ${(y + dy * arm).toFixed(1)}V${y.toFixed(1)}H${(x + dx * arm).toFixed(1)}`)
      .join(''))
    labels.track.style.left = percent(x0 / WIDTH)
    labels.track.style.bottom = percent(1 - (y0 - 4) / HEIGHT)

    const head = toWorld(tool, TOOL_TIP)
    tip.setAttribute('cx', head.x.toFixed(2))
    tip.setAttribute('cy', head.y.toFixed(2))
    let route = `M${head.x.toFixed(2)} ${head.y.toFixed(2)}`
    trail.forEach((dot, i) => {
      const age = (i + 1) * TRAIL.step
      const shown = t - age >= TRAIL.start
      dot.setAttribute('display', shown ? 'inline' : 'none')
      if (!shown) return
      const past = toWorld(toolPose(t - age, clockTime - age), TOOL_TIP)
      dot.setAttribute('cx', past.x.toFixed(2))
      dot.setAttribute('cy', past.y.toFixed(2))
      route += `L${past.x.toFixed(2)} ${past.y.toFixed(2)}`
    })
    path.setAttribute('d', route)
  }

  // The film strip and step 5: the newest thumbnail gains outlines once
  // segmented and its phase once recognized, while a window marks the recent
  // frames the phase model reads and the action shows beside the jaws.
  function drawFilm(t, loop, tool) {
    const slide = 1 - ease(ramp(t, SLIDE))
    const segmented = ramp(t, [SWEEP[1] - 0.2, SWEEP[1] + 0.2])
    const phased = ramp(t, PHASE_FILL)
    film.forEach(({ frame, tool, marks, bar }, i) => {
      const slot = i - 1
      const index = loop - (SLOTS - 1 - slot)
      const newest = slot === SLOTS - 1
      frame.setAttribute('transform', `translate(${(2 + (slot + slide) * STEP).toFixed(2)} ${FILM_Y})`)
      tool.setAttribute('transform', `rotate(${filmAngle(index).toFixed(2)} ${FILM_PIVOT})`)
      marks.forEach((mark) => mark.setAttribute('opacity', newest ? segmented.toFixed(3) : 1))
      const [color, opacity] = PHASE_COLORS[index < EARLIER_PHASE_UNTIL ? 0 : 1]
      bar.setAttribute('fill', color)
      bar.setAttribute('fill-opacity', opacity)
      bar.setAttribute('width', newest ? (STEP * phased).toFixed(2) : STEP)
    })

    const width = (WINDOW_SLOTS * STEP + 2) * ease(ramp(t, [WINDOW[0], WINDOW[1]]))
    filmWindow.setAttribute('x', (479.5 - width).toFixed(2))
    filmWindow.setAttribute('width', width.toFixed(2))
    filmWindow.setAttribute('opacity', fade(t, WINDOW).toFixed(3))
    labels.phase.classList.toggle('is-visible', t >= PHASE_ON)
    labels.phase.classList.toggle('is-reviewed', t >= CLICKS[2])

    // Below and right of the jaws, clear of the shaft and the pulled tissue.
    const bite = toWorld(tool, BITE)
    labels.action.style.left = percent((bite.x + 14) / WIDTH)
    labels.action.style.top = percent((bite.y + 14) / HEIGHT)
    labels.action.classList.toggle('is-visible', within(t, [PHASE_ON, STAGES[5][0]]))
  }

  // Step 6: the reviewer clicks the instrument, the tissue, and the phase in turn.
  function drawCursor(t, targets) {
    const opacity = fade(t, CURSOR)
    cursor.style.opacity = opacity.toFixed(3)
    if (!opacity) return

    const stops = [CURSOR_ENTRY, ...targets, CURSOR_EXIT]
    let leg = 0
    while (leg < CURSOR_LEGS.length && t >= CURSOR_LEGS[leg][1]) leg++
    const moving = leg < CURSOR_LEGS.length && t > CURSOR_LEGS[leg][0]
    const point = moving ? lerp(stops[leg], stops[leg + 1], ease(ramp(t, CURSOR_LEGS[leg]))) : stops[leg]
    cursor.style.left = percent(point.x / WIDTH)
    cursor.style.top = percent(point.y / HEIGHT)
    cursor.classList.toggle('is-pressing', CLICKS.some((click) => t >= click - 0.06 && t < click + 0.14))
  }

  function drawRipple(t, targets) {
    const click = CLICKS.findIndex((start) => within(t, [start, start + RIPPLE]))
    ripple.setAttribute('opacity', click < 0 ? 0 : (1 - (t - CLICKS[click]) / RIPPLE).toFixed(3))
    if (click < 0) return

    ripple.setAttribute('cx', targets[click].x.toFixed(2))
    ripple.setAttribute('cy', targets[click].y.toFixed(2))
    ripple.setAttribute('r', (4 + 18 * ((t - CLICKS[click]) / RIPPLE)).toFixed(2))
  }

  // Earlier steps keep a full progress line, and the current step's description shows.
  let shownStage = -1
  function drawSteps(t, still) {
    const stage = STAGES.findIndex((range) => within(t, range))
    if (stage !== shownStage) {
      steps.forEach((step, i) => {
        step.classList.toggle('is-done', i < stage)
        step.classList.toggle('is-active', i === stage)
        if (i === stage) step.setAttribute('aria-current', 'step')
        else step.removeAttribute('aria-current')
      })
      details.forEach((detail, i) => detail.classList.toggle('is-active', i === stage))
      shownStage = stage
    }
    steps[stage].style.setProperty('--step-progress', still ? 1 : ramp(t, STAGES[stage]).toFixed(3))
  }

  // Draws the figure at time t within the loop, with the parts posed at the
  // clock time, as the given loop's frame.
  function draw(t, clockTime, loop, still = false) {
    const tool = toolPose(t, clockTime)
    const tissue = tissuePose(clockTime)
    const pull = tissuePull(t, clockTime, tissue)
    tools.forEach((group) => group.setAttribute('transform', transformOf(tool)))
    tissues.forEach((group) => group.setAttribute('transform', transformOf(tissue)))
    const jaw = jawAngle(tool.open)
    jaws[0].setAttribute('transform', `rotate(${jaw.toFixed(2)} ${JAW_HINGE.join(' ')})`)
    jaws[1].setAttribute('transform', `rotate(${(-jaw).toFixed(2)} ${JAW_HINGE.join(' ')})`)
    toolOutlinePath.setAttribute('d', toolOutline(tool.open))
    const shape = tissueOutline(pull)
    tissueShapes.forEach((path) => path.setAttribute('d', shape))

    drawCapture(t, tool, tissue)
    drawFeatures(t, tool, tissue, pull)
    drawSegmentation(t, tool, tissue, pull)
    drawTracking(t, tool, clockTime)
    drawFilm(t, loop, tool)
    const targets = [toWorld(tool, TOOL_CLICK), toWorld(tissue, TISSUE_CLICK), PHASE_CLICK]
    drawCursor(t, targets)
    drawRipple(t, targets)
    drawSteps(t, still)
  }

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let time = 0
  // Shifts the loop against the clock when a step is chosen.
  let offset = 0
  let stillStage = MARKUP_STAGE
  let lastFrame = 0
  let request = 0
  let paused = false
  let visible = true

  function render() {
    const total = time + offset
    draw(total % CYCLE, time, Math.floor(total / CYCLE))
    clock.textContent = timecode(time)
  }

  // With reduced motion the hand's sway stops, and each still is the first loop's frame.
  function showStill() {
    draw(STILLS[stillStage], 0, 0, true)
  }

  function tick(now) {
    time += Math.min(Math.max(now - lastFrame, 0), 50) / 1000
    lastFrame = now
    render()
    request = requestAnimationFrame(tick)
  }

  // Runs only while motion is allowed, the visitor has not paused, and the figure is on screen.
  function update() {
    const run = !motion.matches && !paused && visible
    if (run && !request) {
      lastFrame = performance.now()
      request = requestAnimationFrame(tick)
    } else if (!run && request) {
      cancelAnimationFrame(request)
      request = 0
    }
  }

  function applyMotionPreference() {
    const animate = !motion.matches
    figure.classList.toggle('is-animated', animate)
    toggle.hidden = !animate
    if (animate) render()
    else showStill()
    update()
  }

  toggle.addEventListener('click', () => {
    paused = !paused
    figure.classList.toggle('is-paused', paused)
    toggle.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation')
    update()
  })

  // A step plays from the start of its stage within the current loop. While
  // paused, or with reduced motion, it shows that stage's still instead.
  steps.forEach((step, i) => {
    step.disabled = false
    step.addEventListener('click', () => {
      if (motion.matches) {
        stillStage = i
        showStill()
        return
      }
      const total = time + offset
      offset = Math.floor(total / CYCLE) * CYCLE + (paused ? STILLS[i] : STAGES[i][0]) - time
      render()
    })
  })

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    update()
  }).observe(figure)

  figure.classList.add('is-scripted')
  motion.addEventListener('change', applyMotionPreference)
  applyMotionPreference()
}
