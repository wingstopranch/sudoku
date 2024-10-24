const easyBoards = [
    [
        [5, 3, null, null, 7, null, null, null, null],
        [6, null, null, 1, 9, 5, null, null, null],
        [null, 9, 8, null, null, null, null, 6, null],
        [8, null, null, null, 6, null, null, null, 3],
        [4, null, null, 8, null, 3, null, null, 1],
        [7, null, null, null, 2, null, null, null, 6],
        [null, 6, null, null, null, null, 2, 8, null],
        [null, null, null, 4, 1, 9, null, null, 5],
        [null, null, null, null, 8, null, null, 7, 9]
    ]
];

const mediumBoards = [
    [
        [null, null, 3, null, 2, null, 6, null, null],
        [9, null, null, 3, null, 5, null, null, 1],
        [null, null, 1, 8, null, 6, 4, null, null],
        [null, null, 8, 1, null, 2, 9, null, null],
        [7, null, null, null, null, null, null, null, 8],
        [null, null, 6, 7, null, 8, 2, null, null],
        [null, null, 2, 6, null, 9, 5, null, null],
        [8, null, null, 2, null, 3, null, null, 9],
        [null, null, 5, null, 1, null, 3, null, null]
    ]
];

const hardBoards = [
    [
        [null, null, null, null, null, 2, null, null, null],
        [null, null, null, 6, null, null, null, null, 3],
        [null, 7, 4, null, 8, null, null, null, null],
        [null, null, null, null, null, 3, null, null, 2],
        [null, 8, null, null, 4, null, null, 1, null],
        [6, null, null, 5, null, null, null, null, null],
        [null, null, null, null, 1, null, 7, 8, null],
        [5, null, null, null, null, 9, null, null, null],
        [null, null, null, 2, null, null, null, null, null]
    ]
];

const expertBoards = [
    [
        [8, null, null, null, null, null, null, null, null],
        [null, null, 3, 6, null, null, null, null, null],
        [null, 7, null, null, 9, null, 2, null, null],
        [null, 5, null, null, null, 7, null, null, null],
        [null, null, null, null, 4, 5, 7, null, null],
        [null, null, null, 1, null, null, null, 3, null],
        [null, null, 1, null, null, null, null, 6, 8],
        [null, null, 8, 5, null, null, null, 1, null],
        [null, 9, null, null, null, null, 4, null, null]
    ]
];

let sudokuBoard, solutionBoard, undoStack = [];
let timer, timeElapsed = 0, hintsAvailable = 3;

function initializeEmptyBoard() {
    sudokuBoard = Array.from({ length: 9 }, () => Array(9).fill(null));
}

function startTimer() {
    timeElapsed = 0;
    clearInterval(timer);
    timer = setInterval(() => {
        timeElapsed++;
        document.getElementById('timer').textContent = `Time: ${timeElapsed}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function selectRandomBoard(difficulty) {
    const boards = {
        easy: easyBoards,
        medium: mediumBoards,
        hard: hardBoards,
        expert: expertBoards
    };
    const selectedBoards = boards[difficulty];
    return shuffleBoard(selectedBoards[Math.floor(Math.random() * selectedBoards.length)]);
}

function shuffleBoard(board) {
    let newBoard = board.map(row => [...row]);
    for (let i = 0; i < 9; i += 3) {
        [newBoard[i], newBoard[i + 1], newBoard[i + 2]] = [newBoard[i + 1], newBoard[i + 2], newBoard[i]];
    }
    return newBoard;
}

function createSudokuBoard() {
    const board = document.getElementById('sudoku-board');
    board.innerHTML = '';
    for (let row = 0; row < 9; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < 9; col++) {
            const td = document.createElement('td');
            const cellValue = sudokuBoard[row][col];
            if (cellValue) {
                td.textContent = cellValue;
                td.classList.add('fixed');
            } else {
                const input = document.createElement('input');
                input.setAttribute('type', 'number');
                input.setAttribute('min', '1');
                input.setAttribute('max', '9');
                input.addEventListener('input', () => {
                    saveUndoState();
                    checkInput();
                });
                td.appendChild(input);
            }
            tr.appendChild(td);
        }
        board.appendChild(tr);
    }
}

function checkInput() {
    const userInput = getUserInput();
    const rows = document.querySelectorAll('#sudoku-board tr');
    rows.forEach((tr, rowIndex) => {
        const cells = tr.querySelectorAll('td');
        cells.forEach((td, colIndex) => {
            const input = td.querySelector('input');
            if (input) {
                const correctValue = solutionBoard && solutionBoard[rowIndex][colIndex];
                if (correctValue && Number(input.value) !== correctValue && input.value !== '') {
                    input.style.color = 'red';
                } else {
                    input.style.color = 'black';
                }
            }
        });
    });
}

function checkSolution() {
    const userInput = getUserInput();
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (userInput[row][col] !== solutionBoard[row][col]) {
                alert("Incorrect solution! Please try again.");
                return;
            }
        }
    }
    alert("Congratulations! You've completed the puzzle correctly!");
    stopTimer();
}

function saveUndoState() {
    const state = getUserInput();
    undoStack.push(state);
}

function undoLastMove() {
    if (undoStack.length > 0) {
        const lastState = undoStack.pop();
        sudokuBoard = lastState;
        createSudokuBoard();
    }
}

function giveHint() {
    if (hintsAvailable > 0) {
        const emptyCells = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (sudokuBoard[i][j] === null) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            sudokuBoard[randomCell.row][randomCell.col] = solutionBoard[randomCell.row][randomCell.col];
            hintsAvailable--;
            createSudokuBoard();
            document.getElementById('hint-counter').textContent = `Hints Left: ${hintsAvailable}`;
        }
    } else {
        alert("No hints left!");
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.getElementById('sudoku-board').classList.toggle('dark-mode');
}

function getUserInput() {
    const userInput = [];
    const rows = document.querySelectorAll('#sudoku-board tr');
    rows.forEach((tr, rowIndex) => {
        const row = [];
        const cells = tr.querySelectorAll('td');
        cells.forEach((td, colIndex) => {
            const input = td.querySelector('input');
            if (input) {
                row.push(Number(input.value) || null);
            } else {
                row.push(sudokuBoard[rowIndex][colIndex]);
            }
        });
        userInput.push(row);
    });
    return userInput;
}

function startNewGame() {
    const selectedDifficulty = document.getElementById('difficulty').value;
    sudokuBoard = selectRandomBoard(selectedDifficulty);
    hintsAvailable = 3;
    undoStack = [];
    document.getElementById('hint-counter').textContent = `Hints Left: ${hintsAvailable}`;
    createSudokuBoard();
    startTimer();
}

function stopGame() {
    stopTimer();
    initializeEmptyBoard();
    createSudokuBoard();
}

document.getElementById('new-game-button').addEventListener('click', startNewGame);
document.getElementById('hint-button').addEventListener('click', giveHint);
document.getElementById('toggle-theme').addEventListener('click', toggleTheme);
document.getElementById('stop-button').addEventListener('click', stopGame);
document.getElementById('undo-button').addEventListener('click', undoLastMove);
document.getElementById('check-button').addEventListener('click', checkSolution);
initializeEmptyBoard();
createSudokuBoard();
