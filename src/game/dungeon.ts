import { random, Rectangle } from '../common/math';

const minRoomSize = 5;
const maxRoomSize = 15;

/**
 * Generate a dungeon.
 *
 * @param mapSize
 * @param rooms
 */
export function generateDungeon(mapSize: number, rooms: number): number[][] {
  const tiles: number[][] = [];
  for (let i = 0; i < mapSize; i++) {
    const row = new Array<number>(mapSize);
    row.fill(0);
    tiles.push(row);
  }
  for (let r = 0; r < rooms; r++) {
    const room = generateRoom(minRoomSize, maxRoomSize, mapSize);
    projectRoom(room, tiles, 1);
  }
  return tiles;
}

/**
 * Generates a room of a minimum and maximum size in a given map size.
 *
 * @param minSize
 * @param maxSize
 * @param mapSize
 */
function generateRoom(
  minSize: number,
  maxSize: number,
  mapSize: number
): Rectangle {
  const x = random(mapSize);
  const y = random(mapSize);
  const w = random(minSize, maxSize);
  const h = random(minSize, maxSize);
  return new Rectangle(w, h, x, y);
}

/**
 * Projects {room} onto a map of {tiles}, setting {fill} for each tile.
 *
 * @param room
 * @param tiles
 */
function projectRoom<T>(room: Rectangle, tiles: T[][], fill: T) {
  for (let row = room.top; row < room.height; row++) {
    for (let col = room.left; col < room.width; col++) {
      tiles[row][col] = fill;
    }
  }
}
