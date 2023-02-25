let allCells = [];

// Set up and update canvas grid
const Grid = (() => {
  let previousCell;
  const canvas = document.getElementById('grid');
  const currentSize = document.querySelector('.current-size');

  canvas.addEventListener('click', e => {
    console.log('click', e.target);
    drawCell(e.target);
  });

  canvas.addEventListener('pointermove', e => {
    // console.log('grid move', e.clientX, e.clientY);
    let cell = document.elementFromPoint(e.clientX, e.clientY);
    // console.log('cell inside listener function:', cell);
    if (cell == null) {
      updatePrevCell('0');
      return;
    }
    if (cell.classList[0] === 'cell' && cell.id != previousCell) drawCell(cell);
  });

  const updatePrevCell = n => previousCell = n;

  const setSize = size => {
    currentSize.textContent = `${size} x ${size}`;
  };

  const drawGrid = (size=11) => {
    allCells = [];
    // let store = JSON.parse(window.localStorage.getItem('canvas'));
    // if (store) size = store.length;
    // console.log('store:', store.length);
    setSize(size);
    // if (!store) store = '0';
    for (let i = 1; i <= size * size; i++) {
      canvas.appendChild(createCell(i, '0'));
    }
    canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  };

  const deleteCells = () => {
    allCells = [];
    window.localStorage.clear();
    console.log('iife', canvas.lastElementChild);
    while (canvas.firstElementChild) {
      canvas.removeChild(canvas.firstElementChild);
    }
  };

  let store = JSON.parse(window.localStorage.getItem('canvas'));
  if (store) {
    
    let size = store.length ** (1/2);
    setSize(size);
    slider.value = size;
    for (let i = 1; i <= store.length; i++) {
      canvas.appendChild(createCell(i, store[i-1]));
    }
    canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  } else drawGrid(11);
  console.log('cells array:', allCells);

  return {drawGrid, deleteCells, updatePrevCell};
})();

// Set up listeners for range slider and clear button
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
    console.log(allCells);
    window.localStorage.setItem('canvas', JSON.stringify(allCells));
  });

  return { slider }
})();

// Create cell divs
function createCell(index, opacity='0') {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('id', index);
  console.log('opacity:', opacity);
  cell.style.opacity = opacity;
  allCells.push(opacity);
  return cell;
}

// Update cell opacity
function drawCell(cell) {
  // console.log('cell inside draw:', cell);
  Grid.updatePrevCell(cell.id);
  let index = +(cell.id) - 1;
  console.log('index:', index);
  console.log('cell id?', allCells[index]);
  let opacity = getComputedStyle(cell).opacity;
  if (opacity == '1') {
    cell.style.opacity = '0';
  } else {
    cell.style.opacity = parseFloat(opacity) + 0.1;
  }
  console.log(cell.style.opacity);
  allCells[index] = getComputedStyle(cell).opacity;
}

