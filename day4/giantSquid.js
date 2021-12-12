const fs = require('fs');
const text = fs.readFileSync('day4/giantSquidData.txt', 'utf-8');
const textByLine = text.split('\n\n');
const callNumbers = textByLine.slice(0, 1)[0].split(',').map((num) => Number(num));

// Get all boards
const boardInputs = textByLine.slice(1);

function boardInputsToArrayOfStrings(boardInputs) {
  return boardInputs.map((boardStr) => {
    boardStr = boardStr.trim();
    return boardStr.replace(/(\n)/gm, ' ');
  })
}
const boards = boardInputsToArrayOfStrings(boardInputs);

/**
 * *Declare class objects for bingo boards and bingo cells
 */
class Board {
  constructor(boardStr) {
    this.isWinner = false;
    this.cells = boardStr.replace(/  /g, ' ').split(' ').map((theCell) => {
      return new Cell(theCell);
    })
    this.rawBoardStr = boardStr;
  }

  checkCellsForNumber(callNumber) {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].value === callNumber) {
        this.cells[i].markCellAsCalled()
      }
    }
    return;
  }

  clone() {
    const newBoard = new Board(this.rawBoardStr);
    for (let i = 0; i < newBoard.cells.length; i++) {
      newBoard.cells[i].isMarked = this.cells[i].isMarked;
    }
    return newBoard;
  }
}

class Cell {
  constructor(num) {
    this.isMarked = false;
    this.value = Number(num);
  }

  markCellAsCalled() {
    return this.isMarked = true;
  }
}


/**
 * *All functions
 */
function isRowAWinCondition(row) {
  let counter = 0;
  row.forEach((cell) => {
    if (cell.isMarked === true) counter++;
  })
  if (counter >= 5) return true;
  else return false;
}

function isColumnAWinCondition(column) {
  // insert column into isColumnAWinCondition as an array
  return isRowAWinCondition(column);
}

function isBoardAWinner(board) {
  const boardArray = board.cells;

  let row = [];
  for (let i = 0; i < boardArray.length; i++) {
    row.push(boardArray[i]);
    if (row.length === 5) {
      if (isRowAWinCondition(row) === true) {
        console.log('The winning row is', row);
        return true;
      }
      row = [];
    }
  }

  let column = [];
  for (let i = 0; i < boardArray.length; i+=5) {
    column.push(boardArray[i]);

    if (column.length === 5) {
      if (isColumnAWinCondition(column) === true) {
        return true;
      }
      i-=24;
      column = [];
    }
  }
  return false;
}

function isSummingAllUnmarkedNumsOnWinner(board) {
  return board.cells.reduce((previous, current) => {
    if (current.isMarked === false) return previous + current.value;
    else return previous;
  }, 0)
}

function isCheckingAllBoardsForWinner(allBoards) {
  let sum;
  for (let i = 0; i < allBoards.length; i++) {
    if (isBoardAWinner(allBoards[i]) === true) {
      winningBoardIndex = i;
      sum = isSummingAllUnmarkedNumsOnWinner(allBoards[i]);
      if (typeof sum ===  'number') return sum;
    }
  }

  return false;
}



function isFindingFinalScore(allBoards, callNumbers) {
  const boardObjects = allBoards.map(board => {
    board = new Board(board);
    return board;
  })

  for (let i = 0; i < callNumbers.length; i++) {
    boardObjects.forEach(board => {
      board.checkCellsForNumber(callNumbers[i]);
    })

    let winningSum = isCheckingAllBoardsForWinner(boardObjects)
    if (winningSum !== false) {
      return winningSum * callNumbers[i];
    }
  }
  return 'Error, no winning board found';
}

/**
 * !TESTS
 */
// const board1 = new Board('1  2  3 4 5 6 7 8 9  10 11 12 13 14 15 16  17 18 19 20 21 22 23 24 25');
// const board2 = JSON.parse(JSON.stringify(board1));
// const board3 = JSON.parse(JSON.stringify(board1));
// const board3 = board1.clone();

// const cell1 = new Cell(5);



// !tests for the board and cell classes
// console.log(board1.isWinner === false);
// console.log(board1.cells.length === 25); //25
// console.log(cell1.value === 5); //5
// console.log(cell1.isMarked === false); //false

// !Tests for checking if the winning conditions for row and column are working.
// board2.cells.forEach(cell => { cell.isMarked = true; })
// let m = 0
// board3.cells.forEach((cell) => {
//   if (m % 5 === 0) cell.isMarked = true;
//   m++;
// })

// console.log(board3);
// console.log(isBoardAWinner(board3, 3) === true);
// console.log(isBoardAWinner(board2, 2) === true);
// console.log(isBoardAWinner(board1, 1) === false);

// console.log(isSummingAllUnmarkedNumsOnWinner(board3) === 270)
// console.log(isSummingAllUnmarkedNumsOnWinner(board2) === 0)
// console.log(isSummingAllUnmarkedNumsOnWinner(board1) === 325)

// console.log(isCheckingAllBoardsForWinner([board1, board2]) === 0) //0 (all board2 cells are marked)
// console.log(isCheckingAllBoardsForWinner([board1, board3]) === 270) //270
// console.log(isCheckingAllBoardsForWinner([board1, board1]) === false) //false

// console.log(isFindingFinalScore([board1, board3], [1, 2, 3, 4, 5]));

// let classBoards = testing123.map(bord => {
//   return new Board(bord)
// })

console.log(isFindingFinalScore(boards, callNumbers) === 5685); // Full data passes test