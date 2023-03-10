
// Set up and update cell array
const cellArray = (() => {
  let allCells = JSON.parse(window.localStorage.getItem('canvas')) || [];
  const getAllCells = () => allCells;
  
  const resetCells = () => allCells = [];
  const createCellArray = arr => allCells = [...arr];
  const updateCell = (index, opacity) => allCells[index] = opacity;
  return { getAllCells, resetCells, createCellArray, updateCell };
})();

// Set up and update canvas grid
const Grid = (() => {
  let previousCell = null;
  const canvas = document.getElementById('grid');
  const currentSize = document.querySelector('.current-size');

  canvas.addEventListener('click', e => {
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

  const drawGrid = size => {
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
  };

  const deleteCells = () => {
    cellArray.resetCells();

    while (canvas.firstElementChild) {
      canvas.removeChild(canvas.firstElementChild);
    }
  };

  drawGrid();

  return {drawGrid, deleteCells, updatePrevCell};
})();

// Set up listeners for range slider and buttons
(function () {
  const slider = document.getElementById('slider');
  const clearBtn = document.querySelector('.clearBtn');
  const saveBtn = document.querySelector('.saveBtn');

  const getSize = () => slider.value;

  slider.oninput = () => {
    Grid.deleteCells();
    Grid.drawGrid(getSize());
  };

  clearBtn.addEventListener('click', () => {
    Grid.deleteCells();
    Grid.drawGrid(getSize());
  });

  saveBtn.addEventListener('click', () => {
    let savedCanvas = cellArray.getAllCells();
    window.localStorage.setItem('canvas', JSON.stringify(savedCanvas));
  });

  return { slider }
})();

// Create cell divs
function createCell(index, opacity='0') {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('id', index);
  cell.style.opacity = opacity;

  return cell;
}

// Update cell opacity
function drawCell(cell) {
  Grid.updatePrevCell(cell.id);
  let index = +(cell.id);

  let opacity = getComputedStyle(cell).opacity;
  let newOpacity = '0';
  if (opacity != '1')
    newOpacity = parseFloat(opacity) + 0.1;

  cell.style.opacity = newOpacity;
  cellArray.updateCell(index, newOpacity);
}
