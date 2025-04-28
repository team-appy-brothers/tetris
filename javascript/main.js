import { theTetrominoes } from './mino.js';

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector('#start-button')
  const restartButton = document.getElementById('restart-button')

  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0

  const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ]

  let currentPosition = 4
  let currentRotation = 0
  let random = Math.floor(Math.random() * theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]

  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)

      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      // displayShape()
      gameOver()
    }
  }

  function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
      restartButton.addEventListener('click', function() { location.reload() })
    }
  }

  // キー操作
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }

  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if (!isAtLeftEdge) currentPosition -= 1
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }
    draw()
  }

  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    if (!isAtRightEdge) currentPosition += 1
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    draw()
  }

  function isAtRight() {
    return current.some(index => (currentPosition + index + 1) % width === 0)
  }

  function isAtLeft() {
    return current.some(index => (currentPosition + index) % width === 0)
  }

  function checkRotatedPosition(P) {
    P = currentPosition
    if ((P+1) % width < 4) {
      if (isAtRight()) {
        currentPosition += 1
        checkRotatedPosition(P)
      }
    }
    else if (P % width > 5) {
      if (isAtLeft()) {
        currentPosition -= 1
        checkRotatedPosition(P)
      }
    }
  }

  function rotate() {
    undraw()
    currentRotation++
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    checkRotatedPosition()
    draw()
  }
  
  document.addEventListener('keyup', control)

  startBtn.addEventListener('click',  () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 100)
    }
  })
})
