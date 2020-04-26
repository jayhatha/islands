import '../styles/index.scss';
import { seedIslands, runBenchmarks } from './methods';

// elements

const container = document.getElementById('container');
const regenButton = document.getElementById('regen');
const benchmarkButton = document.getElementById('benchmark');
const growthInput = document.getElementById('growthFactor');
const iterationInput = document.getElementById('iterations');
const islandCountInput = document.getElementById('islandCount');
const paletteSelect = document.getElementById('palette');

// palettes
const palettes = {
  standard: ['#FBF8F5', '#AA995B', '#87A79B', '#CDE1DC', '#9E919D'],
  moss: [
    '#cad2c5ff',
    '#84a98cff',
    '#52796fff',
    '#354f52ff',
    '#2f3e46ff',
  ],
  pastel: [
    '#9c89b8ff',
    '#f0a6caff',
    '#efc3e6ff',
    '#f0e6efff',
    '#b8beddff',
  ],
  sunset: ['#eeaf61', '#fb9062', '#ee5d6c', '#ce4993', '#6a0d83'],
};

// config

const config = {
  gridSize: 4096,
  growthFactor: 10,
  iterations: 7,
  islandCount: 7,
  palette: palettes.standard,
  container,
};
const makeGrid = seedIslands;

// handlers
const updateGrowthValue = (e) => {
  config.growthFactor = e.target.value;
};
const updateIterationValue = (e) => {
  config.iterations = e.target.value;
};
const updateIslandCount = (e) => {
  config.islandCount = e.target.value;
};
const updatePalette = (e) => {
  config.palette = palettes[e.target.value];
};
const regenerateGrid = () => {
  regenButton.textContent = 'Regenerating ...';
  while (container.firstChild) {
    container.firstChild.remove();
  }
  makeGrid(config);
  regenButton.textContent = 'Regenerate';
};

// init

document.addEventListener('DOMContentLoaded', () => {
  regenButton.onclick = () => regenerateGrid();
  benchmarkButton.onclick = () => runBenchmarks(config);
  growthInput.addEventListener('change', updateGrowthValue);
  iterationInput.addEventListener('change', updateIterationValue);
  islandCountInput.addEventListener('change', updateIslandCount);
  paletteSelect.addEventListener('change', updatePalette);
  makeGrid(config);
});
