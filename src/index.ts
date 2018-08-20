import { World } from './game/world/world';
import { Draw } from './graphics/draw';
// const context = canvas.getContext('2d') as CanvasRenderingContext2D;

// function readCanvasDimensions(): void {
//   canvas.width = FLAGS_DIMENSIONS.width;
//   canvas.height = FLAGS_DIMENSIONS.height;
// }

// readCanvasDimensions();

class State {
  public readonly world: World = new World();
  public readonly draw: Draw = new Draw(document.querySelector(
    'canvas'
  ) as HTMLCanvasElement);
}
export const state: State = new State();

function renderFrames(time: number): void {
  state.draw.clear();

  // Display the time.
  state.draw.context.textAlign = 'center';
  state.draw.text(`Hello There! ${Math.round(time)}`, state.draw.getCenter());

  state.world.update();
  state.world.render();

  window.requestAnimationFrame(renderFrames);
}

window.requestAnimationFrame(renderFrames);
