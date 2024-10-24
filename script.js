const easyBoards = [
    [/* Add pre-filled easy boards here */],
    [/* Another easy board */]
];
const mediumBoards = [/* Add medium boards here */];
const hardBoards = [/* Add hard boards here */];
const expertBoards = [/* Add expert boards here */];

let sudokuBoard, solutionBoard;
let timer, timeElapsed = 0, hintsAvailable = 3;

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
                const correctValue = solutionBoard[rowIndex][colIndex];
                if (Number(input.value) !== correctValue && input.value !== '') {
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
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        sudokuBoard[randomCell.row][randomCell.col] = solutionBoard[randomCell.row][randomCell.col];
        hintsAvailable--;
        createSudokuBoard();
        document.getElementById('hint-counter').textContent = `Hints Left: ${hintsAvailable}`;
    } else {
        alert("No hints left!");
    }
}

function validateSudoku(board) {
    // Logic to validate if the solution is correct
    return true;
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

function saveScore(time) {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const playerName = prompt("Enter your name:");
    highScores.push({ name: playerName, time });
    highScores.sort((a, b) => a.time - b.time);
    localStorage.setItem('highScores', JSON.stringify(highScores.slice(0, 10)));
    showLeaderboard();
}

function showLeaderboard() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = highScores.map((score, index) => `<p>${index + 1}. ${score.name} - ${score.time}s</p>`).join('');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.getElementById('sudoku-board').classList.toggle('dark-mode');
}

document.getElementById('new-game-button').addEventListener('click', () => {
    const selectedDifficulty = document.getElementById('difficulty').value;
    sudokuBoard = selectRandomBoard(selectedDifficulty);
    startTimer();
    hintsAvailable = 3;
    document.getElementById('hint-counter').textContent = `Hints Left: ${hintsAvailable}`;
    createSudokuBoard();
});

document.getElementById('check-button').addEventListener('click', () => {
    const userInput = getUserInput();
    if (validateSudoku(userInput)) {
        stopTimer();
        alert(`Congratulations! You solved it in ${timeElapsed} seconds.`);
        saveScore(timeElapsed);
    } else {
        alert("Incorrect solution. Try again!");
