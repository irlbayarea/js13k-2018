import { Draw } from './common/graphics/draw';
import { Input } from './common/input/input';
import { World } from './game/world/world';

// Defines application / game driver state. This is exported as a single
// object, `state` to be consumed throughout the game.
class State {
  public readonly draw: Draw = new Draw(document.querySelector(
    'canvas'
  ) as HTMLCanvasElement);
  public readonly input: Input = new Input();
}

// Function that is called each frame.
function renderFrames(time: number): void {
  state.draw.clear();
  state.input.processEvents();

  // Display the time.
  state.draw.context.textAlign = 'center';
  state.draw.text(`Hello There! ${Math.round(time)}`, state.draw.getCenter());

  const millisInSecond = 1000;
  world.update(time / millisInSecond);
  world.render();

  window.requestAnimationFrame(renderFrames);
}

// Set up application state.
export const state: State = new State();
const world: World = new World();

// Start the game driver.
window.requestAnimationFrame(renderFrames);
