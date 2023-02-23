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

  const drawGrid = size => {
    setSize(size);
    for (let i = 1; i <= size * size; i++) {
      canvas.appendChild(createCell(i));
    }
    canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  };

  const deleteCells = () => {
    console.log('iife', canvas.lastElementChild);
    while (canvas.firstElementChild) {
      canvas.removeChild(canvas.firstElementChild);
    }
  };

  drawGrid(11);

  return {drawGrid, deleteCells, updatePrevCell};
})();

// Set up listeners for range slider and clear button
const Controls = (() => {
  const range = document.getElementById('slider');
  const clearBtn = document.querySelector('button');
  const getSize = () => range.value;

  range.oninput = () => {
    Grid.deleteCells();
    Grid.drawGrid(getSize());
  };

  clearBtn.addEventListener('click', () => {
    Grid.deleteCells();
    Grid.drawGrid(getSize());
  });
})();

// Create cell divs
function createCell(index) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('id', index);
  return cell;
}

// Update cell opacity
function drawCell(cell) {
  // console.log('cell inside draw:', cell);
  Grid.updatePrevCell(cell.id);
  let opacity = getComputedStyle(cell).opacity;
  if (opacity == '1') {
    cell.style.opacity = '0';
  } else {
    cell.style.opacity = parseFloat(opacity) + 0.1;
  }
}