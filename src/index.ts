import { AudioHandler } from './common/audio/audio';
import { Draw } from './common/graphics/draw';
import { Input } from './common/input/input';
import { Vec2 } from './common/math/vec2';
import { aSecondInMs, Timer } from './common/time';
import { World } from './game/world/world';

// Defines application / game driver state. This is exported as a single object,
// `state` to be consumed throughout the game.
class State {
  public readonly draw = new Draw(document.querySelector(
    'canvas'
  ) as HTMLCanvasElement);
  public readonly input = new Input();
}

const timer = new Timer();

// Function that is called each frame.
function renderFrames(time: number) {
  state.draw.clear();
  state.input.processEvents();

  // Display the time.
  state.draw.context.textAlign = 'left';
  state.draw.text(
    `Hello There! ${Math.round(time)}`,
    // tslint:disable-next-line:no-magic-numbers
    new Vec2(20, state.draw.canvas.height - 20)
  );

  world.update(time / aSecondInMs);
  world.render();
  window.requestAnimationFrame(timer.update);
}

// Set up application state.
export const state = new State();
const world = new World();
const audio = new AudioHandler();

// Start the game driver.
timer.subscribe(renderFrames);
audio.playMusic();
window.requestAnimationFrame(timer.update);
