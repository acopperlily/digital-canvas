let size = 16;

function createCells() {
  let cell = document.createElement('div');
  // cell.style.width = "100px";
  // cell.style.height = "100px";
  // cell.style.backgroundColor = "red";
  cell.classList.add('cell');
  cell.addEventListener('mouseenter', function () {
    draw(cell);
  });
  return cell;
}

const grid = document.querySelector('#grid');
for (let i = 0; i < size * size; i++) {
  grid.appendChild(createCells());
}

function draw(e) {
  e.style.backgroundColor = "black";
}

function clearCells() {
  console.log('wut');
  let cell = document.getElementsByClassName('cell');
  for (let i = 0; i < size * size; i++) {
    cell[i].style.backgroundColor = 'red';
  }
}

function getSize() {
  let size = parseInt(prompt('Enter size of new grid: '));
  return size;
}

const btn = document.querySelector('button');
btn.addEventListener('click', function () {
  clearCells();
});

