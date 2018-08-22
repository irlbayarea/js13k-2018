import { World } from './game/world/world';
import { Draw } from './graphics/draw';

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

  const millisInSecond = 1000;
  state.world.update(time / millisInSecond);
  state.world.render();

  window.requestAnimationFrame(renderFrames);
}

window.requestAnimationFrame(renderFrames);
