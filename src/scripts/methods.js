// import { countBy } from 'lodash';

export const islands = [];
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
  console.log(islands);
};
const isClaimed = (id) => {
  const el = document.getElementById(id);
  return el ? el.classList.contains('claimed') : false;
};

const findPotentialPaints = () => {
  // get all claimed ids
  const claimedIds = [];
  const claimedSquares = document.getElementsByClassName('claimed');
  for (const island of claimedSquares) {
    claimedIds.push(parseInt(island.id, 10));
  }
  // find their adjacents
  const potentiallyPaintable = [];
  for (const id of claimedIds) {
    const sourceIsland = document.getElementById(id);
    const bgColor = sourceIsland.style.backgroundColor;
    const adjacents = findAdjacent(id);
    for (const item of adjacents) {
      potentiallyPaintable.push({
        id: item,
        backgroundColor: bgColor,
      });
    }
  }
  return potentiallyPaintable;
};

const paintableSquares = () => {
  const squaresToPaint = [];
  const candidates = findPotentialPaints();
  for (const id of candidates) {
    let openBorders = 0;
    const adjacents = findAdjacent(id.id);
    for (const item of adjacents) {
      if (!isClaimed(item.id)) {
        openBorders += 1;
        if (openBorders > 2) {
          squaresToPaint.push(id);
        }
      }
    }
  }
  return squaresToPaint;
};

const paintSquares = (squaresToPaint) => {
  for (const square of squaresToPaint) {
    const island = document.getElementById(square.id);
    if (island && !island.style.backgroundColor) {
      window.setTimeout(1000);
      island.style.backgroundColor = square.backgroundColor;
      island.classList.add('claimed', 'island');
    }
  }
};

const growIsland = (paintable, growthRate) => {
  const potentialNewTerritory = paintable;
  const theExpanse = [];
  for (let j = 0; j < potentialNewTerritory.length; j += 1) {
    if (Math.floor(Math.random() * 100) < growthRate) {
      theExpanse.push(potentialNewTerritory[j]);
    }
  }
  paintSquares(theExpanse);
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

  let x = paintableSquares(findPotentialPaints());
  paintAdjacents(findSeeds());
  for (let i = 0; i < iterations; i += 1) {
    growIsland(x, growthFactor);
    x = paintableSquares(findPotentialPaints());
  }
};
