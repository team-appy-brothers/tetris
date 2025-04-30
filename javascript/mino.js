const width = 10

// L字型のミノの形を定義
export const lTetromino = [
  [1, width+1, width*2+1, 2],
  [width, width+1, width+2, width*2+2],
  [1, width+1, width*2+1, width*2],
  [width, width*2, width*2+1, width*2+2]
]

// Z字型のミノの形を定義
export const zTetromino = [
  [0,width,width+1,width*2+1],
  [width+1, width+2,width*2,width*2+1],
  [0,width,width+1,width*2+1],
  [width+1, width+2,width*2,width*2+1]
]

// T字型のミノの形を定義
export const tTetromino = [
  [1,width,width+1,width+2],
  [1,width+1,width+2,width*2+1],
  [width,width+1,width+2,width*2+1],
  [1,width,width+1,width*2+1]
]

// O字型のミノの形を定義
export const oTetromino = [
  [0,1,width,width+1],
  [0,1,width,width+1],
  [0,1,width,width+1],
  [0,1,width,width+1]
]

// I字型のミノの形を定義
export const iTetromino = [
  [1,width+1,width*2+1,width*3+1],
  [width,width+1,width+2,width+3],
  [1,width+1,width*2+1,width*3+1],
  [width,width+1,width+2,width+3]
]

// 次のミノを表示させるグリッドの幅とインデックスを定義
const displayWidth = 4;
// 次のミノの形を定義
export const upNextTetrominoes = [
  // L字型
  [1, displayWidth+1, displayWidth*2+1, 2],
  // Z字型
  [0, displayWidth, displayWidth+1, displayWidth*2+1],
  // T字型
  [1, displayWidth, displayWidth+1, displayWidth+2],
  // 正方形
  [0, 1, displayWidth, displayWidth+1],
  // I字型
  [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
];

// 表示させるミノの形をエクスポート
export const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]