const gridSize = 10;
const words = ['JAVASCRIPT', 'HTML', 'CSS', 'GRID', 'GAME', 'CODE', 'PROGRAM'];
let wordGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
let selectedCells = [];
let foundWords = [];

// HTML elements
const gridElement = document.getElementById('word-grid');
const wordListElement = document.getElementById('word-list');

// Initialize the grid and word list
function initGame() {
    fillGridWithRandomLetters();
    placeWordsInGrid();
    displayGrid();
    displayWordList();
}

// Fill the grid with random letters
function fillGridWithRandomLetters() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            wordGrid[row][col] = letters[Math.floor(Math.random() * letters.length)];
        }
    }
}

// Place words in the grid in multiple directions
function placeWordsInGrid() {
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            let direction = getRandomDirection();
            let row = Math.floor(Math.random() * gridSize);
            let col = Math.floor(Math.random() * gridSize);
            if (canPlaceWord(word, row, col, direction)) {
                placeWord(word, row, col, direction);
                placed = true;
            }
        }
    });
}

// Randomly select a direction: horizontal, vertical, or diagonal
function getRandomDirection() {
    const directions = ['horizontal', 'vertical', 'diagonal'];
    return directions[Math.floor(Math.random() * directions.length)];
}

// Check if a word can be placed in the chosen direction
function canPlaceWord(word, row, col, direction) {
    if (direction === 'horizontal' && col + word.length > gridSize) return false;
    if (direction === 'vertical' && row + word.length > gridSize) return false;
    if (direction === 'diagonal' && (row + word.length > gridSize || col + word.length > gridSize)) return false;
    
    for (let i = 0; i < word.length; i++) {
        let checkRow = row + (direction === 'vertical' || direction === 'diagonal' ? i : 0);
        let checkCol = col + (direction === 'horizontal' || direction === 'diagonal' ? i : 0);
        if (wordGrid[checkRow][checkCol] !== '') return false;
    }
    return true;
}

// Place a word in the grid
function placeWord(word, row, col, direction) {
    for (let i = 0; i < word.length; i++) {
        let setRow = row + (direction === 'vertical' || direction === 'diagonal' ? i : 0);
        let setCol = col + (direction === 'horizontal' || direction === 'diagonal' ? i : 0);
        wordGrid[setRow][setCol] = word[i];
    }
}

// Display the grid on the page
function displayGrid() {
    gridElement.innerHTML = '';
    wordGrid.forEach((row, rowIndex) => {
        row.forEach((letter, colIndex) => {
            const cell = document.createElement('div');
            cell.textContent = letter;
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;
            cell.addEventListener('mousedown', startSelection);
            cell.addEventListener('mouseover', continueSelection);
            cell.addEventListener('mouseup', endSelection);
            gridElement.appendChild(cell);
        });
    });
}

// Display the word list
function displayWordList() {
    wordListElement.innerHTML = '';
    words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        wordListElement.appendChild(li);
    });
}

// Handle the start of a word selection
function startSelection(event) {
    clearSelection();
    const selectedCell = event.target;
    selectedCells.push(selectedCell);
    selectedCell.classList.add('selected');
}

// Handle continuing the selection
function continueSelection(event) {
    if (selectedCells.length > 0 && event.buttons === 1) {
        const selectedCell = event.target;
        if (!selectedCells.includes(selectedCell)) {
            selectedCells.push(selectedCell);
            selectedCell.classList.add('selected');
        }
    }
}

// Handle the end of a word selection
function endSelection() {
    let selectedWord = selectedCells.map(cell => cell.textContent).join('');
    checkSelectedWord(selectedWord);
    clearSelection();
}

// Check if the selected word matches any in the word list
function checkSelectedWord(selectedWord) {
    if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
        foundWords.push(selectedWord);
        markWordAsFound(selectedWord);
    }
}

// Mark a word as found in the grid and list
function markWordAsFound(word) {
    selectedCells.forEach(cell => cell.classList.add('found'));
    const wordItem = [...wordListElement.children].find(li => li.textContent === word);
    if (wordItem) {
        wordItem.classList.add('found');
    }
}

// Clear the current selection
function clearSelection() {
    selectedCells.forEach(cell => cell.classList.remove('selected'));
    selectedCells = [];
}

// Initialize the game when the page loads
window.onload = initGame;
