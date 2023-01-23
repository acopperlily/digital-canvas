const slider = document.getElementById('slider');
let size = slider.value;

const currentSize = document.querySelector('.current-size');
currentSize.textContent = `${slider.value} x ${slider.value}`;

function createCells() {
  let cell = document.createElement('div');
  cell.classList.add('cell');
  cell.addEventListener('mouseenter', function () {
    draw(cell);
  });
  cell.addEventListener('click', function () {
    draw(cell);
  });
  return cell;
}

const grid = document.querySelector('#grid');
grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

for (let i = 0; i < size * size; i++) {
  grid.appendChild(createCells());
}

function newGrid(grid, size) {
  for (let i = 0; i < size * size; i++) {
    grid.appendChild(createCells());
  }
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
}

function draw(e) {
  e.style.backgroundColor = "black";
  let opacity = getComputedStyle(e).opacity;
  if (opacity == '1') {
    e.style.opacity = '0';
  } else {
    e.style.opacity = parseFloat(opacity) + 0.1;
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