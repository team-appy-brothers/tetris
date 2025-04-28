import { theTetrominoes } from './mino.js';

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector('#start-button')

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

  startBtn.addEventListener('click',  () => {
    draw()
  })
})