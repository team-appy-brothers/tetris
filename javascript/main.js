// ./mino.jsからミノの情報をインポート
import { theTetrominoes } from './mino.js';
import { upNextTetrominoes } from './mino.js';

document.addEventListener("DOMContentLoaded", () => {
  // グリッドの幅
  const width = 10;
  // グリッドの要素を取得
  const grid = document.querySelector(".grid");
  // グリッドのdiv要素を取得
  let squares = Array.from(document.querySelectorAll(".grid div"));
  // スコアの要素を取得
  const scoreDisplay = document.querySelector("#score");
  // スタートボタンの要素を取得
  const startBtn = document.querySelector('#start-button');
  // ゲーム終了後に表示される要素の取得
  const resultMessageElement = document.getElementById('resultMessage');
  // ゲーム終了後のスコアを表示する要素の取得
  const resultMessageTextElement = document.querySelector('[data-winning-message-text');
  // リスタートボタンの要素を取得
  const restartButton = document.getElementById('restart-button');

  // ミノの色
  const colors = ['orange', 'red', 'purple', 'green', 'blue'];
  // 何秒ごとにミノを落とすか＆スコアの初期値
  let timerId, score = 0;
  // ミノの初期位置とデフォルトの向きの定義
  let currentPosition = 4, currentRotation = 0;
  // ミノの種類をランダムに選ぶ
  let random = Math.floor(Math.random() * theTetrominoes.length);
  // 次のミノの種類の初期値
  let nextRandom = 0;
  // 現在のミノをランダムに選び、格納
  let current = theTetrominoes[random][currentRotation];

  // ミノの描画
  function draw() {
    // ミノが含むグリッドの数だけループ
    current.forEach(index => {
      // ミノが描画されているグリッドの位置にクラスを追加
      squares[currentPosition + index].classList.add('tetromino');
      // 同様にミノの色を指定
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
    // ミノの形を描画
    displayShape();
  }

  // ミノの削除
  // ミノが下に落ちた際などに一度描画を削除し、再度描画するための関数
  function undraw() {
    // ミノが含むグリッドの数だけループ
    current.forEach(index => {
      // ミノが描画されているグリッドの位置のクラス（tetromino）を削除
      squares[currentPosition + index].classList.remove('tetromino');
      // 同様にミノの背景色を削除
      squares[currentPosition + index].style.backgroundColor = '';
    });
  }

  // ミノを下に移動させる関数
  function moveDown() {
    // ミノの描画を削除
    undraw();
    // ミノをひとつ下に移動
    // グリッドの横幅はwidthで定義されているので、widthを足すことで下に移動
    currentPosition += width;
    // ミノの描画
    draw();
    // ミノが下に移動できない場合
    freeze();
  }

  // ミノが下に移動できない場合の処理
  function freeze() {
    // ミノのひとつ下の位置にすでにミノがある場合
    if (current.some(index => squares[currentPosition + index + width]?.classList.contains('taken'))) {
      // 現在の位置にミノを描画
      current.forEach(index => squares[currentPosition + index].classList.add('taken'));
      // 次のミノを取得
      random = nextRandom;
      // その次のミノをランダムに選ぶ
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      // 次のミノを格納
      current = theTetrominoes[random][currentRotation];
      // ミノの初期位置をリセット
      currentPosition = 4;
      // ミノの描画
      draw();
      // ミノの形を表示
      displayShape();
      // スコアを加算
      addScore();
      // ゲームオーバーの判定
      gameOver();
    }
  }

  // ミノを左に移動させる関数
  function moveLeft() {
    // ミノの描画を削除
    undraw();
    // ミノの位置が左端でない場合にひとつ左に移動
    if (!current.some(index => (currentPosition + index) % width === 0)) currentPosition--;
    // ミノの左にすでにミノがある場合、ひとつ右に移動
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) currentPosition += 1;
    // ミノの描画
    draw();
  }

  // ミノを右に移動させる関数
  function moveRight() {
    // ミノの描画を削除
    undraw();
    // ミノの位置が右端でない場合にひとつ右に移動
    if (!current.some(index => (currentPosition + index) % width === width - 1)) currentPosition++;
    // ミノの右にすでにミノがある場合、ひとつ左に移動
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) currentPosition -= 1;
    // ミノの描画
    draw();
  }

  // 現在の位置が右端かどうかを判定する関数
  function isAtRight() {
    return current.some(index => (currentPosition + index + 1) % width === 0);
  }

  // 現在の位置が左端かどうかを判定する関数
  function isAtLeft() {
    return current.some(index => (currentPosition + index) % width === 0);
  }

  // 回転時の位置を調整する関数
  function checkRotatedPosition(pos = currentPosition) {
    // 回転後の位置が右端の場合
    if ((pos + 1) % width < 4 && isAtRight()) {
      // ミノの位置をひとつ左に移動
      currentPosition++;
      // 回転後の位置を再度チェック
      checkRotatedPosition(pos);
    // 回転後の位置が左端の場合
    } else if (pos % width > 5 && isAtLeft()) {
      // ミノの位置をひとつ右に移動
      currentPosition--;
      // 回転後の位置を再度チェック
      checkRotatedPosition(pos);
    }
  }

  // ミノを回転させる関数
  function rotate() {
    // ミノの描画を削除
    undraw();
    // 現在のミノのオブジェクトの中から、回転した状態のミノを取得
    currentRotation = (currentRotation + 1) % theTetrominoes[random].length;
    // 回転後のミノを格納
    current = theTetrominoes[random][currentRotation];
    // ミノの位置を調整
    checkRotatedPosition();
    // ミノの描画
    draw();
  }

  // ゲームオーバーの判定
  function gameOver() {
    // ミノの位置が上端に達している場合
    if (current.some(index => squares[currentPosition + index]?.classList.contains('taken'))) {
      // スコアの要素を取得
      scoreDisplay.innerHTML = score;
      // 一定時間でミノが落ちてくる処理を停止
      clearInterval(timerId);
      // スコアを表示
      resultMessageTextElement.innerText = `Score: ${score}`;
      // ゲームオーバーのメッセージを表示
      resultMessageElement.classList.add('show');
      // リスタートボタンクリックした場合、画面をリロードする
      restartButton.addEventListener('click', () => location.reload());
    }
  }

  // キーボードの操作を制御する関数
  function control(e) {
    // 押下したキーコードに応じてミノを操作
    switch (e.keyCode) {
      // ←：左に移動
      case 37: moveLeft(); break;
      // ↑：ミノの回転
      case 38: rotate(); break;
      // →：右に移動
      case 39: moveRight(); break;
      // ↓：下にひとつ移動
      case 40: moveDown(); break;
    }
  }

  // 次のミノを表示させる要素を取得
  const displaySquares = document.querySelectorAll('.mini-grid div');
  // 次のミノを表示させるグリッドのインデックスを定義
  const displayIndex = 0;

  // 次のミノを表示させる関数
  function displayShape() {
    // 次のミノの形が含むグリッドの数だけループ
    displaySquares.forEach(square => {
      // 次のミノが描画されているグリッドの位置のクラスを削除
      square.classList.remove('tetromino');
      // 同様に次のミノの背景色を削除
      square.style.backgroundColor = '';
    });
    // 次のミノの描画
    upNextTetrominoes[nextRandom].forEach(index => {
      // 次のミノが描画されているグリッドの位置にクラスを追加
      displaySquares[displayIndex + index].classList.add('tetromino');
      // 同様に次のミノの色を指定
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    });
  }

  // スコアを加算する関数
  function addScore() {
    // グリッドの各要素をループ
    for (let i = 0; i < 199; i += width) {
      // グリッドの横幅分だけループ
      const row = Array.from({length: width}, (_, k) => i + k);
      // その行のすべてのグリッドが「taken」クラスを持っている場合
      if (row.every(index => squares[index].classList.contains('taken'))) {
        // スコアを加算
        score += 10;
        // スコアを表示する要素にスコアを加算
        scoreDisplay.innerHTML = score;
        // その行のグリッドの要素数だけループ
        row.forEach(index => {
          // グリッドの要素のクラスを削除
          squares[index].classList.remove('taken', 'tetromino');
          // グリッドの要素の背景色を削除
          squares[index].style.backgroundColor = '';
        });
        // グリッドの要素を上に移動
        const removed = squares.splice(i, width);
        // 上に移動したグリッドの要素を下に追加
        squares = removed.concat(squares);
        // グリッドの要素をループ
        squares.forEach(cell => grid.appendChild(cell));
      }
    }
  }

  // スタートボタンをクリックしたときの処理
  startBtn.addEventListener('click', () => {
    // カーソルキーによってミノを操作
    document.addEventListener('keyup', control);
    // timerIdがすでに存在している（すでにゲームが開始している場合）
    if (timerId) {
      // ミノが落ちる処理を停止
      clearInterval(timerId);
      // timerIdをnullにリセット
      timerId = null;
    // timerIdが存在しない（ゲームが開始されていない場合）
    } else {
      // ミノの描画
      draw();
      // ミノが落ちる処理を1秒ごとに繰り返す
      timerId = setInterval(moveDown, 1000);
      // 次のミノをランダムに選ぶ
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    }
  });
});
