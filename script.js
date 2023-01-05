const submit_button = document.querySelector('.submit_button')
const inputs = document.querySelectorAll('.input_box__input')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const output = document.querySelector('.output_box__data_set')
const zoomInBtn = document.querySelector('.zoom_in')
const zoomOutBtn = document.querySelector('.zoom_out')

// varaiables
let values = []
let orginalValues = []
let warningMessage =
  'Nie można zbudować trójkąta, którego suma długości dwóch boków jest mniejsza niż długość trzeciego boku.'
let isPossibleToBuildTriangle = false
let canvasWidth = canvas.clientWidth
let canvasHeight = canvas.clientHeight
let zoom = 0.7

const clearOutputValues = () => (output.innerHTML = '')

const checkIfPossibleToBuildTriangle = () => {
  const [a, b, c] = values
  if (a + b > c && a + c > b && b + c > a) {
    isPossibleToBuildTriangle = true
  } else {
    isPossibleToBuildTriangle = false
  }
}

const displayWarning = () => {
  const warning = document.createElement('div')
  warning.classList.add('output_box__warning')
  warning.innerHTML = warningMessage
  output.appendChild(warning)
}

const displayOutput = (dataName, dataValue) => {
  const outputData = document.createElement('div')
  outputData.classList.add('output_box__data_row')
  outputData.innerHTML = `
    <div class="output_box__data_name">${dataName}</div>
    <div class="output_box__data_value">${dataValue}</div>
  `
  output.appendChild(outputData)
}

const setValuesToVariables = () => {
  values = []
  orginalValues = []
  inputs.forEach((input) => {
    values.push(Number(input.value))
    orginalValues.push(Number(input.value))
  })
  orginalValues.sort((a, b) => b - a)
  values.sort((a, b) => b - a) // [2,5,3] => [5,3,2]
}

const fixNumber = (number) => Number(number.toFixed(2))

const calculateArea = () => {
  const [a, b, c] = values
  const s = (Number(a) + Number(b) + Number(c)) / 2
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c))
  return fixNumber(area)
}

const calculatePerimeter = () => {
  const [a, b, c] = values
  const perimeter = Number(a) + Number(b) + Number(c)
  return perimeter
}

const scaleSides = () => {
  const [a, b, c] = values
  const maxSide = Math.max(a, b, c)
  const scale = (canvasWidth * zoom) / maxSide
  values[0] = fixNumber(scale * a)
  values[1] = fixNumber(scale * b)
  values[2] = fixNumber(scale * c)
}

const clearCanvas = () => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
}

const drawPoint = (x, y, color) => {
  ctx.beginPath()
  ctx.arc(x, y, 2, 0, 2 * Math.PI)
  ctx.fillStyle = color
  ctx.fill()
}

const drawCircle = (x, y, radius, color) => {
  ctx.lineWidth = 0.3
  ctx.setLineDash([5, 5])
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.stroke()
}

const drawLabel = (x, y, letter) => {
  ctx.font = '12px Poppins'
  ctx.fillStyle = '#13b313'
  ctx.fillText(letter, x - 5, y - 10)
}

// draw triangle
const drawTriangle = () => {
  clearCanvas()

  const [a, b, c] = values
  const s = (Number(a) + Number(b) + Number(c)) / 2
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c))
  const height = (2 * area) / a
  const angle = Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c))
  const angleInDegrees = (angle * 180) / Math.PI

  // set color of site
  ctx.strokeStyle = '#13b313'
  ctx.setLineDash([1, 0])

  // set site width
  ctx.lineWidth = 3

  // set coordinates of site
  let x0 = 0 + (canvasWidth - a) / 2
  let y0 = (canvasHeight + b) / 2
  let x1 = a + (canvasWidth - a) / 2
  let subtractOfSquereRadiuses = b * b - c * c
  let bx = (subtractOfSquereRadiuses + a * a) / (2 * a) + (canvasWidth - a) / 2
  let by = Math.sqrt(b * b - bx * bx)

  // // draw a side
  // ctx.beginPath()
  // ctx.moveTo(x0, y0)
  // ctx.lineTo(x1, y0)
  // ctx.stroke()

  // // draw b side
  // ctx.beginPath()
  // ctx.strokeStyle = '#d6e412'
  // ctx.moveTo(x0, y0)
  // ctx.lineTo(x0, y0 - b)
  // ctx.stroke()

  // // draw c side
  // ctx.beginPath()
  // ctx.strokeStyle = '#e41212'

  // ctx.moveTo(x1, y0)
  // ctx.lineTo(x1, y0 - c)
  // ctx.stroke()

  // draw triangle
  ctx.strokeStyle = '#0bf01e'
  ctx.fillStyle = '#0bf01e32'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(bx, y0 - height)
  ctx.lineTo(x1, y0)
  ctx.lineTo(x0, y0)
  ctx.stroke()
  ctx.fill()

  // draw circles on radius b and c
  drawCircle(x0, y0, b, '#13b313')
  drawCircle(x1, y0, c, '#13b313')

  // draw points
  ctx.fillStyle = '#00ff00'
  drawPoint(x0, y0, '#13b313')
  drawPoint(x1, y0, '#13b313')
  drawPoint(bx, y0 - height, '#13b313')

  // draw labels on points
  drawLabel(x0, y0, 'A')
  drawLabel(x1, y0, 'B')
  drawLabel(bx, y0 - height, 'C')

  // draw labels sides
  drawLabel(x0 + a / 2, y0 + 20, `a = ${orginalValues[0]}`) // a
  drawLabel((x0 + bx) / 2, (y0 + y0 - height) / 2, `b = ${orginalValues[1]}`) // b
  drawLabel((x1 + bx) / 2, (y0 + y0 - height) / 2, `c = ${orginalValues[2]}`) // c
}

const runProgram = () => {
  setValuesToVariables()
  clearOutputValues()
  checkIfPossibleToBuildTriangle()
  if (isPossibleToBuildTriangle) {
    displayOutput('Pole =', calculateArea())
    displayOutput('Obwód =', calculatePerimeter())
  } else {
    displayWarning()
  }
  scaleSides()
  drawTriangle()
}

zoomInBtn.addEventListener('click', () => {
  zoom += 0.1
  runProgram()
})

zoomOutBtn.addEventListener('click', () => {
  zoom -= 0.1
  runProgram()
})

submit_button.addEventListener('click', () => {
  runProgram()
})
