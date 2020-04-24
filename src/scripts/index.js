import '../styles/index.scss';
import { random, randomBreak, randomAdditive, seedIslands, findAdjacent } from './methods';

// elements
const container = document.getElementById('container');
const regenButton = document.getElementById('regen');
// consts
const initialColors = ['#FBF8F5', '#AA995B', '#87A79B', '#CDE1DC', '#9E919D' ];
// config
let makeGrid = seedIslands;
// helpers
const regenerateGrid = () => {
  while (container.firstChild) {
    container.firstChild.remove();
}
  makeGrid(4096, initialColors);
};;

document.addEventListener("DOMContentLoaded", function() {
  regenButton.onclick = () => regenerateGrid();
  makeGrid(4096, initialColors);
});
