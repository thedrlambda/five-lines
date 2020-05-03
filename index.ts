
const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum RawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE, FALLING_STONE,
  BOX, FALLING_BOX,
  KEY1, LOCK1,
  KEY2, LOCK2
}

interface Tile {
  isAir(): boolean;
  isStone(): boolean;
  isFallingStone(): boolean;
  isBox(): boolean;
  isFallingBox(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  moveHorizontal(dx: number): void;
  moveVertical(dy: number): void;
  isStony(): boolean;
  isBoxy(): boolean;
}

class Air implements Tile {
  isAir() { return true; }
  isStone() { return false; }
  isFallingStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) { }
  moveHorizontal(dx: number) {
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number) {
    moveToTile(playerx, playery + dy);
  }
  isStony() { return false; }
  isBoxy() { return false; }
}

class Flux implements Tile {
  isAir() { return false; }
  isStone() { return false; }
  isFallingStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ccffcc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number) {
    moveToTile(playerx, playery + dy);
  }
  isStony() { return false; }
  isBoxy() { return false; }
}

class Unbreakable implements Tile {
  isAir() { return false; }
  isStone() { return false; }
  isFallingStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) { }
  moveVertical(dy: number) { }
  isStony() { return false; }
  isBoxy() { return false; }
}

class Player implements Tile {
  isAir() { return false; }
  isStone() { return false; }
  isFallingStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) { }
  moveHorizontal(dx: number) { }
  moveVertical(dy: number) { }
  isStony() { return false; }
  isBoxy() { return false; }
}

class Stone implements Tile {
  isAir() { return false; }
  isStone() { return true; }
  isFallingStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {
    if (map[playery][playerx + dx + dx].isAir()
      && !map[playery + 1][playerx + dx].isAir()) {
      map[playery][playerx + dx + dx] = this;
      moveToTile(playerx + dx, playery);
    }
  }
  moveVertical(dy: number) { }
  isStony() { return true; }
  isBoxy() { return false; }
}

class FallingStone implements Tile {
  isAir() { return false; }
  isStone() { return false; }
  isFallingStone() { return true; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) { }
  moveVertical(dy: number) { }
  isStony() { return true; }
  isBoxy() { return false; }
}

class Box implements Tile {
  isAir() { return false; }
  isStone() { return false; }
  isFallingStone() { return false; }
  isBox() { return true; }
  isFallingBox() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {
    if (map[playery][playerx + dx + dx].isAir()
      && !map[playery + 1][playerx + dx].isAir()) {
      map[playery][playerx + dx + dx] = this;
      moveToTile(playerx + dx, playery);
    }
  }
  moveVertical(dy: number) { }
  isStony() { return false; }
  isBoxy() { return true; }
}

class FallingBox implements Tile {
  isAir() { return false; }
  isStone() { return false; }
  isFallingStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return true; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) { }
  moveVertical(dy: number) { }
  isStony() { return false; }
  isBoxy() { return true; }
}

class Key1 implements Tile {
  isAir() { return false; }
  isStone() { return false; }
  isFallingStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {
    removeLock1();
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number) {
    removeLock1();
    moveToTile(playerx, playery + dy);
  }
  isStony() { return false; }
  isBoxy() { return false; }
}

class Lock1 implements Tile {
  isAir() { return false; }
  isStone() { return false; }
  isFallingStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isLock1() { return true; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) { }
  moveVertical(dy: number) { }
  isStony() { return false; }
  isBoxy() { return false; }
}

class Key2 implements Tile {
  isAir() { return false; }
  isStone() { return false; }
  isFallingStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#00ccff";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {
    removeLock2();
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number) {
    removeLock2();
    moveToTile(playerx, playery + dy);
  }
  isStony() { return false; }
  isBoxy() { return false; }
}

class Lock2 implements Tile {
  isAir() { return false; }
  isStone() { return false; }
  isFallingStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isLock1() { return false; }
  isLock2() { return true; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#00ccff";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) { }
  moveVertical(dy: number) { }
  isStony() { return false; }
  isBoxy() { return false; }
}

interface Input {
  handle(): void;
}

class Right implements Input {
  handle() {
    map[playery][playerx + 1].moveHorizontal(1);
  }
}

class Left implements Input {
  handle() {
    map[playery][playerx - 1].moveHorizontal(-1);
  }
}

class Up implements Input {
  handle() {
    map[playery - 1][playerx].moveVertical(-1);
  }
}

class Down implements Input {
  handle() {
    map[playery + 1][playerx].moveVertical(1);
  }
}

let playerx = 1;
let playery = 1;
let rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];
let map: Tile[][];
function assertExhausted(x: never): never {
  throw new Error("Unexpected object: " + x);
}
function transformTile(tile: RawTile) {
  switch (tile) {
    case RawTile.AIR: return new Air();
    case RawTile.PLAYER: return new Player();
    case RawTile.UNBREAKABLE: return new Unbreakable();
    case RawTile.STONE: return new Stone();
    case RawTile.FALLING_STONE: return new FallingStone();
    case RawTile.BOX: return new Box();
    case RawTile.FALLING_BOX: return new FallingBox();
    case RawTile.FLUX: return new Flux();
    case RawTile.KEY1: return new Key1();
    case RawTile.LOCK1: return new Lock1();
    case RawTile.KEY2: return new Key2();
    case RawTile.LOCK2: return new Lock2();
    default: assertExhausted(tile);
  }
}
function transformMap() {
  map = new Array(rawMap.length);
  for (let y = 0; y < rawMap.length; y++) {
    map[y] = new Array(rawMap[y].length);
    for (let x = 0; x < rawMap[y].length; x++) {
      map[y][x] = transformTile(rawMap[y][x]);
    }
  }
}

let inputs: Input[] = [];

function removeLock1() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock1()) {
        map[y][x] = new Air();
      }
    }
  }
}
function removeLock2() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock2()) {
        map[y][x] = new Air();
      }
    }
  }
}

function moveToTile(newx: number, newy: number) {
  map[playery][playerx] = new Air();
  map[newy][newx] = new Player();
  playerx = newx;
  playery = newy;
}

function update() {
  handleInputs();
  updateMap();
}

function handleInputs() {
  while (inputs.length > 0) {
    let input = inputs.pop();
    input.handle();
  }
}

function updateMap() {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      updateTile(x, y);
    }
  }
}

function updateTile(x: number, y: number) {
  if (map[y][x].isStony()
    && map[y + 1][x].isAir()) {
    map[y + 1][x] = new FallingStone();
    map[y][x] = new Air();
  } else if (map[y][x].isBoxy()
    && map[y + 1][x].isAir()) {
    map[y + 1][x] = new FallingBox();
    map[y][x] = new Air();
  } else if (map[y][x].isFallingStone()) {
    map[y][x] = new Stone();
  } else if (map[y][x].isFallingBox()) {
    map[y][x] = new Box();
  }
}

function createGraphics() {
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
  let g = canvas.getContext("2d");
  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function draw() {
  let g = createGraphics();
  drawMap(g);
  drawPlayer(g);
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].draw(g, x, y);
    }
  }
}

function drawPlayer(g: CanvasRenderingContext2D) {
  g.fillStyle = "#ff0000";
  g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(gameLoop, sleep);
}

window.onload = () => {
  transformMap();
  gameLoop();
}

const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;
window.addEventListener("keydown", e => {
  if (e.keyCode === 37 || e.key === "a") inputs.push(new Left());
  else if (e.keyCode === 38 || e.key === "w") inputs.push(new Up());
  else if (e.keyCode === 39 || e.key === "d") inputs.push(new Right());
  else if (e.keyCode === 40 || e.key === "s") inputs.push(new Down());
});

