/**
 * This is a simple Sudoku game implemented using HTML canvas and JavaScript.
 * The game generates a random Sudoku grid and displays it on the canvas.
 * 
 * It is done by following the steps below:
 * 1. Generate a Sudoku grid
 * 2. Solve the generated grid
 * 3. Shuffle rows and columns
 * 4. Shuffle numbers (1-9)
 * 5. Replace each number in the grid with the corresponding shuffled number
 * 6. Draw the grid and numbers on the canvas
 * 7. Enjoy the game!
 * 
 * Made after reading: https://www.geeksforgeeks.org/sudoku-backtracking-7/
 * 
 * Author: @FreddyFlamingo
 * 
 */


// Get the canvas element
const canvas = document.getElementById("SudokuCanvas");
const ctx = canvas.getContext("2d");
const CANVAS_SIZE =700;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

const FONT_SIZE = Math.floor(canvas.width / 9 / 2);

// Define the Sudoku grid size
const GRID_SIZE = 9;
const BLOCK_SIZE = 3;
const CELL_SIZE = canvas.width / GRID_SIZE;

// Generate a random Sudoku grid
function generateSudokuGrid() {
    const grid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        grid[i] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            grid[i][j] = 0;
        }
    }
    solveSudoku(grid);

    // Shuffle rows within each block
    for (let i = 0; i < BLOCK_SIZE; i++) {
        const shuffleStart = i * BLOCK_SIZE;
        const shuffleEnd = shuffleStart + BLOCK_SIZE;
        const shuffledRows = grid.slice(shuffleStart, shuffleEnd);
        shuffledRows.sort(() => Math.random() - 0.5);
        grid.splice(shuffleStart, BLOCK_SIZE, ...shuffledRows);
    }

    // Transpose the grid to shuffle columns
    for (let i = 0; i < BLOCK_SIZE; i++) {
        for (let j = i + 1; j < BLOCK_SIZE; j++) {
            const temp = grid[i][j];
            grid[i][j] = grid[j][i];
            grid[j][i] = temp;
        }
    }

    // Shuffle numbers (1-9)
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(numbers);

    // Replace each number in the grid with the corresponding shuffled number
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] !== 0) {
                grid[i][j] = numbers[grid[i][j] - 1];
            }
        }
    }
    
    return grid;
}

// Check if the value is safe to place in the given position
function isSafe(grid, row, col, num) {
    for (let x = 0; x < GRID_SIZE; x++) {
        if (grid[row][x] === num || grid[x][col] === num) {
            return false;
        }
    }
    const startRow = row - (row % BLOCK_SIZE);
    const startCol = col - (col % BLOCK_SIZE);
    for (let i = 0; i < BLOCK_SIZE; i++) {
        for (let j = 0; j < BLOCK_SIZE; j++) {
            if (grid[i + startRow][j + startCol] === num) {
                return false;
            }
        }
    }
    return true;
}

// Solve Sudoku using backtracking
function solveSudoku(grid) {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (grid[row][col] === 0) {
                for (let num = 1; num <= GRID_SIZE; num++) {
                    if (isSafe(grid, row, col, num)) {
                        grid[row][col] = num;
                        if (solveSudoku(grid)) {
                            return true;
                        }
                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray(array) {
    const n = array.length;
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function drawSudokuGrid(grid, visibleNumbersCount) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    // Draw grid lines
    for (let i = 0; i <= GRID_SIZE; i++) {
        if (i % BLOCK_SIZE === 0) {
            ctx.lineWidth = BLOCK_SIZE;
        } else {
            ctx.lineWidth = 1;
        }
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
      
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }

    // Draw numbers
    ctx.font = `${FONT_SIZE}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    let visibleNumbers = [];
    for (visibleNumbersCount; visibleNumbersCount > 0; visibleNumbersCount--) {
        let row = Math.floor(Math.random() * GRID_SIZE);
        let col = Math.floor(Math.random() * GRID_SIZE);
        let num = grid[row][col];

        if (num === 0 || visibleNumbers.includes(`${row}-${col}`)) {
            visibleNumbersCount++;
            continue;
        } else {
            visibleNumbers.push(`${row}-${col}`);
            ctx.fillText(num, (col * CELL_SIZE) + (CELL_SIZE / 2), (row * CELL_SIZE) + (CELL_SIZE / 2));
        }
    }
}

// Generate a random Sudoku grid
const sudokuGrid = generateSudokuGrid();

// Draw the Sudoku grid on the canvas
drawSudokuGrid(sudokuGrid, 31);
