// import { countBy } from 'lodash';

const islands = [];
const splits = [];
const randomColor = (colors) =>
  colors[Math.floor(Math.random() * colors.length)];
const findSeeds = () => {
  const seedNums = [];
  const seedIslands = document.getElementsByClassName('seed');
  for (const island of seedIslands) {
    seedNums.push(parseInt(island.id, 10));
  }
  return seedNums;
};
export const findAdjacent = (num) => {
  // corners
  if (num === 0) {
    return [1, 64];
  }
  if (num === 63) {
    return [63, 127];
  }
  if (num === 4032) {
    return [4033, 3968];
  }
  if (num === 4095) {
    return [4094, 4032];
  }
  // edges
  // top row
  if (num > 0 && num < 63) {
    return [num + 64, num + 1, num - 1];
  }
  // bottom row
  if (num > 4032 && num < 4095) {
    return [num - 64, num + 1, num - 1];
  }
  // left edge
  if (num > 63 && num < 4032 && num % 64 === 0) {
    return [num + 1, num + 64, num - 64];
  }
  // right edge
  if (num > 63 && num < 4095 && (num + 1) % 64 === 0) {
    return [num - 1, num + 64, num - 64];
  }
  // default
  return [num + 1, num - 1, num + 64, num - 64];
};

const paintAdjacents = () => {
  const t0 = performance.now();
  for (let t = 0; t < islands.length; t += 1) {
    const thisIsland = islands[t];
    const adjacents = findAdjacent(thisIsland.seed);
    for (const item of adjacents) {
      const island = document.getElementById(item);
      island.style.backgroundColor = thisIsland.bgColor;
      island.classList.add('claimed', t);
      thisIsland.territory.push(item);
    }
  }
  const t1 = performance.now();
  splits.push(`paintAdjacents ${t1 - t0}`);
};

// const isClaimed = (id) => {
//   const el = document.getElementById(id);
//   return el ? el.classList.contains('claimed') : false;
// };

const findPotentialPaints = () => {
  const t0 = performance.now();
  // get all claimed ids
  const potentiallyPaintable = [];
  for (let i = 0; i < islands.length; i += 1) {
    const claimedIds = islands[i].territory;
    for (const id of claimedIds) {
      const adjacents = findAdjacent(id);
      for (const item of adjacents) {
        potentiallyPaintable.push({
          id: item,
          backgroundColor: islands[i].bgColor,
          island: i,
        });
      }
    }
  }
  // find their adjacents

  const t1 = performance.now();
  splits.push(`findPotentialPaints ${t1 - t0}`);
  return potentiallyPaintable;
};
const hasNeighbors = (candidate) => {
  let neighbors = 0;
  const adjacents = findAdjacent(candidate.id);
  for (let i = 0; i < adjacents.length; i += 1) {
    const el = document.getElementById(adjacents[i]);
    if (
      el.classList.contains('claimed') &&
      !el.classList.contains(candidate.island)
    ) {
      neighbors += 1;
    }
  }
  return neighbors;
};

const decideWhichSquaresToPaint = (potentials) => {
  const t0 = performance.now();
  const candidates = [...potentials];
  const squaresToPaint = [];
  for (const candidate of candidates) {
    if (
      !hasNeighbors(candidate) &&
      squaresToPaint.indexOf(candidate) === -1
    ) {
      squaresToPaint.push(candidate);
    }
  }

  const t1 = performance.now();
  splits.push(`decideWhichSquaresToPaint ${t1 - t0}`);
  return squaresToPaint;
};

const paintSquares = (squaresToPaint) => {
  const t0 = performance.now();
  for (const target of squaresToPaint) {
    const newSquare = document.getElementById(target.id);
    if (newSquare && !newSquare.style.backgroundColor) {
      newSquare.style.backgroundColor = target.backgroundColor;
      newSquare.classList.add('claimed', target.island);
      islands[target.island].territory.push(target.id);
    }
  }
  const t1 = performance.now();
  splits.push(`paintSquares ${t1 - t0}`);
};

const growIsland = (paintable, growthRate) => {
  const t0 = performance.now();
  const potentialNewTerritory = paintable;
  const theExpanse = [];
  for (let j = 0; j < potentialNewTerritory.length; j += 1) {
    if (Math.floor(Math.random() * 100) < growthRate) {
      theExpanse.push(potentialNewTerritory[j]);
    }
  }
  paintSquares(theExpanse);
  const t1 = performance.now();
  splits.push(`growIsland ${t1 - t0}`);
};

// const selectIsland = (islandNumber) => {};

export const random = (num, cols, container) => {
  const newItems = [];
  const colors = [...cols];
  for (let i = 0; i < num; i += 1) {
    const color = randomColor(colors);
    newItems.push(document.createElement('div'));
    newItems[i].classList.add('item');
    newItems[i].id = i;
    newItems[i].style.backgroundColor = color;
  }
  for (const el of newItems) {
    container.appendChild(el);
  }
};

export const randomAdditive = (num, cols, container) => {
  const newItems = [];
  const colors = [...cols];
  for (let i = 0; i < num; i += 1) {
    const color = randomColor(colors);
    newItems.push(document.createElement('div'));
    newItems[i].classList.add('item');
    newItems[i].id = i;
    newItems[i].style.backgroundColor = color;
    colors.push(color);
  }
  for (const el of newItems) {
    container.appendChild(el);
  }
};

export const randomBreak = (num, cols, container) => {
  const newItems = [];
  const colors = [...cols];
  const colors2 = [...cols];
  for (let i = 0; i < num; i += 1) {
    const target =
      i > Math.floor(Math.random() * num) ? colors2 : colors;
    const color = randomColor(target);
    newItems.push(document.createElement('div'));
    newItems[i].classList.add('item');
    newItems[i].id = i;
    newItems[i].style.backgroundColor = color;
    target.push(color);
  }
  for (const el of newItems) {
    container.appendChild(el);
  }
  // console.log(countBy(colors));
  // console.log(countBy(colors2));
};
export const makeGrid = (gridSize, container) => {
  const newItems = [];
  for (let i = 0; i < gridSize; i += 1) {
    newItems.push(document.createElement('div'));
    newItems[i].classList.add('item');
    newItems[i].id = i;
  }
  for (const el of newItems) {
    container.appendChild(el);
  }
};

export const seedIslands = (config) => {
  const {
    gridSize,
    palette,
    growthFactor,
    islandCount,
    iterations,
    container,
  } = config;
  const colors = [...palette];
  makeGrid(gridSize, container);
  islands.length = 0;
  for (let s = 0; s < islandCount; s += 1) {
    const seedNum = Math.floor(Math.random() * gridSize);
    const color = randomColor(colors);
    const newIsland = {
      seed: seedNum,
      territory: [seedNum],
      bgColor: color,
    };
    islands.push(newIsland);
  }
  for (let t = 0; t < islands.length; t += 1) {
    const thisIsland = islands[t];
    const paintTarget = document.getElementById(thisIsland.seed);
    paintTarget.style.backgroundColor = thisIsland.bgColor;
    paintTarget.classList.add('claimed', 'seed', t);
  }
  let x;
  paintAdjacents(findSeeds());
  for (let i = 0; i < iterations; i += 1) {
    x = decideWhichSquaresToPaint(findPotentialPaints());
    growIsland(x, growthFactor);
  }
};
export const runBenchmarks = (config) => {
  const benchmarks = [];
  const container = document.getElementById('container');
  const results = document.getElementById('benchmarkResults');
  results.textContent = 'running ...';
  for (let i = 0; i < 10; i += 1) {
    const t0 = performance.now();
    seedIslands(config);
    const t1 = performance.now();
    benchmarks.push(t1 - t0);
    while (container.firstChild) {
      container.firstChild.remove();
    }
  }
  seedIslands(config);
  // console.log(splits);
  splits.length = 0;
  results.textContent =
    benchmarks.reduce((a, b) => a + b) / benchmarks.length;
};
