// Set up and update cell array
const cellArray = (() => {
  let allCells = JSON.parse(window.localStorage.getItem('canvas')) || [];
  let isSaved = false;
  if (allCells.length) {
    isSaved = true;
  }
  const getAllCells = () => allCells;
  
  const resetCells = () => allCells = [];
  const createCellArray = arr => allCells = [...arr];
  const updateCell = (index, opacity) => allCells[index] = opacity;
  return { getAllCells, resetCells, createCellArray, updateCell, isSaved };
})();

// Set up and update canvas grid
const Grid = (() => {
  let previousCell = null;
  const canvas = document.getElementById('main__grid');
  const currentSize = document.querySelector('.slider-size');

  canvas.addEventListener('click', e => {
    console.log('test', e.target.id);
    if (e.target.id !== 'main__grid')
      drawCell(e.target);
  });

  canvas.addEventListener('pointermove', e => {
    let cell = document.elementFromPoint(e.clientX, e.clientY);
    if (cell == null) {
      updatePrevCell(null);
      return;
    }
    if (cell.classList[0] === 'cell' && cell.id != previousCell) 
      drawCell(cell);
  });

  const updatePrevCell = n => previousCell = n;

  const setSize = size => {
    slider.value = size;
    currentSize.textContent = `${size} x ${size}`;
  };

  const drawGrid = (size=11) => {
    let newArray = cellArray.getAllCells();
    if (newArray.length) {
      size = parseInt(newArray.length ** (1 / 2));
    } else {
      newArray = Array(size * size).fill('0');
      cellArray.createCellArray(newArray);
    }

    setSize(size);
    for (let i = 0; i < size * size; i++) {
      canvas.appendChild(createCell(i, newArray[i]));
    }
    canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    // updateIsSaved();
  };

  const deleteCells = () => {
    cellArray.resetCells();

    while (canvas.firstElementChild) {
      canvas.removeChild(canvas.firstElementChild);
    }
  };

  drawGrid();
  updateIsSaved(cellArray.isSaved);

  return {drawGrid, deleteCells, updatePrevCell};
})();

// Set up listeners for range slider and buttons
(function () {
  const slider = document.getElementById('slider');
  const clearBtn = document.querySelector('.clearBtn');
  const saveBtn = document.querySelector('.saveBtn');
  const menu = document.querySelector('.header__menuBtn');
  const overlay = document.querySelector('.test');
  const canvas = document.querySelector('#main__grid');
  const controls = document.querySelector('#main__controls');
  const toggleGridlines = document.getElementById('toggleGridlines');

  toggleGridlines.addEventListener('change', () => {
    const cellDivs = document.querySelectorAll('.grid__cellContainer');
    cellDivs.forEach(div => {
      div.setAttribute('data-gridlines', toggleGridlines.checked);
    });
  });

  const getSize = () => slider.value;

  slider.oninput = () => {
    Grid.deleteCells();
    Grid.drawGrid(getSize());
    updateIsSaved();
  };

  clearBtn.addEventListener('click', () => {
    Grid.deleteCells();
    Grid.drawGrid(getSize());
    updateIsSaved();
  });

  saveBtn.addEventListener('click', () => {
    const check = document.querySelector('.saved');
    const save = document.querySelector('.save-text');
    let savedCanvas = cellArray.getAllCells();
    window.localStorage.setItem('canvas', JSON.stringify(savedCanvas));

    if (!cellArray.isSaved)
      updateIsSaved(true);
  });

  return { toggleGridlines, slider }
})();

// Create cell divs
function createCell(index, opacity='0') {
  const cellContainer = document.createElement('div');
  const cell = document.createElement('div');
  cellContainer.classList.add('grid__cellContainer');
  cellContainer.setAttribute('data-gridlines', toggleGridlines.checked);
  cell.classList.add('cell');
  cell.setAttribute('id', index);
  cell.style.opacity = opacity;
  cellContainer.appendChild(cell);
  return cellContainer;
}

// Update cell opacity
function drawCell(cell) {
  Grid.updatePrevCell(cell.id);
  let index = +(cell.id);

  let opacity = getComputedStyle(cell).opacity;
  let newOpacity = '0';
  if (opacity != '1')
    newOpacity = (parseFloat(opacity) + 0.1).toFixed(1);

  cell.style.opacity = newOpacity;
  cellArray.updateCell(index, newOpacity);
  if (cellArray.isSaved === true) 
    updateIsSaved();
}

function updateIsSaved(bool) {
  cellArray.isSaved = bool || false;
  const check = document.querySelector('.saved-text');
  const save = document.querySelector('.default-text');
  if (bool) {
    check.classList.remove('hidden');
    save.classList.add('hidden');
  } else {
    check.classList.add('hidden');
    save.classList.remove('hidden');
  }
}

// Get dates for footer
const setDateRange = () => {
  let currentYear = new Date().getFullYear();
  // Copyright unicode: \u00a9
  currentYear = `\u00a9 ${currentYear}`;
  const footerSpan = document.querySelector('.footer__date');
  footerSpan.textContent = currentYear;
}

setDateRange();
