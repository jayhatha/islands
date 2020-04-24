import '../styles/index.scss';

const container = document.getElementById('container');
const regenButton = document.getElementById('regen');


const randomColor = (colors) =>  (colors[Math.floor(Math.random()*colors.length)]);
const colors = ['#FBF8F5', '#AA995B', '#87A79B', '#CDE1DC', '#9E919D' ];
const makeGrid = (num, colors) => {
  let newItems = [];
  for (let i = 0; i < num; i += 1) {
    let color = randomColor(colors);
    newItems.push(document.createElement('div'));
    newItems[i].classList.add('item');
    newItems[i].id = i;
    newItems[i].style.backgroundColor = color;
  }
  for (const el of newItems) {
    container.appendChild(el);
  }
};
const regenerateGrid = () => {
  while (container.firstChild) {
    container.firstChild.remove();
}
  makeGrid(4096, colors);
};
document.addEventListener("DOMContentLoaded", function() {
  regenButton.onclick = () => regenerateGrid();
  makeGrid(4096, colors);
});
