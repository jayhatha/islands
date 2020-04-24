import {countBy} from 'lodash';

const randomColor = (colors) =>  (colors[Math.floor(Math.random()*colors.length)]);
const findSeeds = () => {
  let seedNums = [];
  let islands = document.getElementsByClassName('seed');
  for (const island of islands) {
    seedNums.push(parseInt(island.id));
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
  if (0 < num && num < 63) {
    return [num + 64, num + 1, num - 1];
  }
  // bottom row 
  if (4032 < num && num < 4095) {
    return [num - 64, num + 1, num - 1];
  }
  // left edge 
  if (num > 63 && num < 4032 && ((num) % 64) === 0) {
    return [num + 1, num + 64, num - 64];
  }
  // right edge
  if (num > 63 && num < 4095 && ((num + 1) % 64) === 0) {
    return [num - 1, num + 64, num - 64 ];
  }
  // default
  return [num + 1, num - 1, num + 64, num - 64];
}; 

const paintAdjacents = (seedNums) => {
  let nums = [...seedNums];
  let bgColor;
  let adjacents;
  let idx = 0;
  for (const num of nums) {
    adjacents = findAdjacent(num);
    idx += 1;
    
    bgColor = document.getElementById(num).style.backgroundColor;
      for (const item of adjacents) {
        let island = document.getElementById(item);
        island.style.backgroundColor = bgColor;
        island.classList.add('claimed', idx);
      }
    adjacents = [];
 ;   }  
};
const isClaimed = (id) => {
  let el = document.getElementById(id);
  if (el) {
  return el.classList.contains('claimed');
  };
};

const findPotentialPaints = () => {
  // get all claimed ids
  let claimedIds = [];
  let claimedSquares = document.getElementsByClassName('claimed');
  for (const island of claimedSquares) {
    claimedIds.push(parseInt(island.id));
  }
  // find their adjacents
  let potentiallyPaintable = [];
  for (const id in claimedIds) {
    let sourceIsland = document.getElementById(claimedIds[id]);
    let bgColor = sourceIsland.style.backgroundColor;
    let adjacents = findAdjacent(claimedIds[id]);   
    for (const item in adjacents) {
      potentiallyPaintable.push({id: adjacents[item], backgroundColor: bgColor});      
      }
    } 
  return potentiallyPaintable;
};

const paintableSquares = () => {
  let squaresToPaint = [];
  let candidates = findPotentialPaints();
  for (const id of candidates) {
    let openBorders = 0;
    let adjacents = findAdjacent(id.id);
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
    let island = document.getElementById(square.id);
    if (island && !island.style.backgroundColor) {
      window.setTimeout(1000);
      island.style.backgroundColor = square.backgroundColor;
      island.classList.add('claimed', 'island');
    }
  }
};

const growIsland = (paintableSquares, growthRate) => {
  let potentialNewTerritory = paintableSquares;
  let theExpanse = [];
    for (let j = 0; j < potentialNewTerritory.length; j += 1) {
      if (Math.floor(Math.random()*100) < growthRate) {
        theExpanse.push(potentialNewTerritory[j]);
      }
    }
    paintSquares(theExpanse);
};

const selectIsland = (islandNumber) => {

};

export const random = (num, cols) => {
  let newItems = [];
  let colors = [...cols];
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

export const randomAdditive = (num, cols) => {
  let newItems = [];
  let colors = [...cols];
  for (let i = 0; i < num; i += 1) {
    let color = randomColor(target);
    newItems.push(document.createElement('div'));
    newItems[i].classList.add('item');
    newItems[i].id = i;
    newItems[i].style.backgroundColor = color;
    target.push(color);
  }
  for (const el of newItems) {
    container.appendChild(el);
  }
};

export const randomBreak = (num, cols) => {
  let newItems = [];
  let colors = [...cols];
  let colors2 = [...cols];
  for (let i = 0; i < num; i += 1) {
    let target = i > Math.floor(Math.random()*num) ? colors2 : colors;
    let color = randomColor(target);
    newItems.push(document.createElement('div'));
    newItems[i].classList.add('item');
    newItems[i].id = i;
    newItems[i].style.backgroundColor = color;
    target.push(color);
  }
  for (const el of newItems) {
    container.appendChild(el);
  }
  console.log(countBy(colors));
  console.log(countBy(colors2));
};

export const seedIslands = (num, cols) => {
  let newItems = [];
  let colors = [...cols];
  let seedNumbers = [];
  for (let s = 0; s < 7; s += 1 ) {
    let seedNum = Math.floor(Math.random()*num);
    seedNumbers.push(seedNum);
  }
  for (let i = 0; i < num; i += 1) {
    let color = randomColor(colors);
    newItems.push(document.createElement('div'));
    newItems[i].classList.add('item');
    newItems[i].id = i;
    if (seedNumbers.includes(i)) {
    newItems[i].style.backgroundColor = color;
    newItems[i].classList.add('claimed', 'seed');
    };
  }
  for (const el of newItems) {
    container.appendChild(el);
  }
  let x = paintableSquares();
  paintAdjacents(findSeeds());
  for (let i = 0; i < 10; i += 1) {
  growIsland(x, 10);
  x = paintableSquares(findPotentialPaints());
  }
};



