import { World } from './game/world/world';
import { Draw } from './graphics/draw';

/**
 * The Input class handles application input.
 */
class Input {
  private readonly keys: Set<KeyboardEvent>;

  constructor() {
    this.keys = new Set<KeyboardEvent>();
    window.addEventListener('keyup', this.keyUp);
    window.addEventListener('keydown', this.keyDown);
  }

  private keyUp(event: KeyboardEvent) {
    this.keys.add(event);
  }

  private keyDown(event: KeyboardEvent) {
    this.keys.add(event);
  }
}

// Defines application / game driver state. This is exported as a single
// object, `state` to be consumed throughout the game.
class State {
  public readonly draw: Draw = new Draw(document.querySelector(
    'canvas'
  ) as HTMLCanvasElement);
}

// Function that is called each frame.
function renderFrames(time: number): void {
  state.draw.clear();

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
const input: Input = new Input();

// Run the application.
window.requestAnimationFrame(renderFrames);
