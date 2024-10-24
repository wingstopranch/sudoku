const easyBoards = [
    // Example easy board (replace with actual Sudoku puzzles)
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
const mediumBoards = [/* Add medium boards here */];
const hardBoards = [/* Add hard boards here */];
const expertBoards = [/* Add expert boards here */];

let sudokuBoard, solutionBoard;
let timer, timeElapsed = 0, hintsAvailable = 3;

// Initialize empty board for demonstration
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
    switch (difficulty) {
        case 'easy':
            return easyBoards[Math.floor(Math.random() * easyBoards.length)];
        case 'medium':
            return mediumBoards[Math.floor(Math.random() * mediumBoards.length)];
        case 'hard':
            return hardBoards[Math.floor(Math.random() * hardBoards.length)];
        case 'expert':
            return expertBoards[Math.floor(Math.random() * expertBoards.length)];
        default:
            return easyBoards[0];
    }
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
                input.addEventListener('input', checkInput);
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
                    input.style.color = 'red'; // Incorrect
                } else {
                    input.style.color = 'black'; // Correct or empty
                }
            }
        });
    });
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
    document.getElementById('hint-counter').textContent = `Hints Left: ${hintsAvailable}`;
    createSudokuBoard();
    startTimer();
}

document.getElementById('new-game-button').addEventListener('click', startNewGame);
document.getElementById('hint-button').addEventListener('click', giveHint);
document.getElementById('toggle-theme').addEventListener('click', toggleTheme);
initializeEmptyBoard(); // Initialize empty board until the first game is started
createSudokuBoard(); // Show empty board initially
