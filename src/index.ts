import { World } from './game/world/world';
import { Draw } from './graphics/draw';

class InputEvent {
  public readonly key: string;
  public readonly down: boolean;

  constructor(key: string, down: boolean) {
    this.key = key;
    this.down = down;
  }
}

/**
 * The Input class handles application input. This clas may be used to check if
 * a key is currently pressed.
 *
 * One purpose of this class is to make the game logic more predictable by
 * preventing input state changes during an update. Call `processEvents` before
 * the game update to process all events added after the last call.
 *
 * Example keys are:
 *   A, B, C, ...
 *   META (), SHIFT, CONTROL, ALT, ' ' (Spacebar)
 */
class Input {
  private readonly pressedKeys: Set<string>;
  private eventBuffer: InputEvent[];

  constructor() {
    this.eventBuffer = [];
    this.pressedKeys = new Set();
    window.addEventListener('keydown', event =>
      this.onKeyEvent(new InputEvent(event.key.toUpperCase(), true))
    );
    window.addEventListener('keyup', event =>
      this.onKeyEvent(new InputEvent(event.key.toUpperCase(), false))
    );
  }

  // Processes input events. Call once before each application frame.
  public processEvents() {
    this.eventBuffer.forEach(e => {
      this.processEvent(e);
    });
    this.eventBuffer = [];
  }

  // Takes one or more key strings and returns true if all the input keys
  // matching those key strings are pressed. E.g. `isPressed('A')` returns true
  // if the "A" key is pressed, and `isPressed('CONTROL', A')` returns true if
  // both "CONTROL" and "A" are pressed.
  public isPressed(...keys: string[]): boolean {
    return keys.every(key => this.pressedKeys.has(key));
  }

  private processEvent(inputEvent: InputEvent) {
    if (inputEvent.down) {
      this.pressedKeys.add(inputEvent.key);
    } else {
      this.pressedKeys.delete(inputEvent.key);
    }
  }

  private onKeyEvent(inputEvent: InputEvent) {
    this.eventBuffer.push(inputEvent);
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
  input.processEvents();

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

// Start the game driver.
window.requestAnimationFrame(renderFrames);
