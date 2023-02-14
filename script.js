const slider = document.getElementById('slider');
let size = slider.value;
let previousCell = '0';

const currentSize = document.querySelector('.current-size');
currentSize.textContent = `${slider.value} x ${slider.value}`;

function createCells(i) {
  let cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('id', i + 1);
  return cell;
}

const grid = document.querySelector('#grid');

grid.addEventListener('pointermove', e => {
  console.log('grid move', e.clientX, e.clientY);
  let cellNum = document.elementFromPoint(e.clientX, e.clientY);
  console.log(cellNum);
  if (cellNum.id && parseInt(cellNum.id) && cellNum.id != previousCell) draw(cellNum.id);
  // draw(cellNum.id);
});

grid.addEventListener('click', e => {
  console.log('click', e.target);
  draw(e.target.id);
});

grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
// grid.style.backgroundColor = 'blue';

for (let i = 0; i < size * size; i++) {
  grid.appendChild(createCells(i));
}

function newGrid(grid, size) {
  for (let i = 0; i < size * size; i++) {
    grid.appendChild(createCells(i));
  }
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
}

function draw(cellNum) {
  console.log('touches in draw?', cellNum);
  console.log('parseint', parseInt(cellNum));
  previousCell = cellNum;
  let cell = document.getElementById(cellNum);
  console.log('cell:', cell);

  cell.style.backgroundColor = "black";
  let opacity = getComputedStyle(cell).opacity;
  if (opacity == '1') {
    cell.style.opacity = '0';
  } else {
    cell.style.opacity = parseFloat(opacity) + 0.1;
  }
}

function deleteCells() {
  while (grid.firstElementChild) {
    grid.removeChild(grid.firstElementChild);
  }
}

const clearBtn = document.querySelector('button');
clearBtn.addEventListener('click', () => {
  deleteCells();
  newGrid(grid, size);
});

slider.oninput = () => {
  deleteCells();
  size = slider.value;
  currentSize.textContent = `${slider.value} x ${slider.value}`
  newGrid(grid, size);
};