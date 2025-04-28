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