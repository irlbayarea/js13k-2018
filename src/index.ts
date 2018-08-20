const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;

function readCanvasDimensions(): void {
  canvas.width = FLAGS_DIMENSIONS.width;
  canvas.height = FLAGS_DIMENSIONS.height;
}

readCanvasDimensions();

const centerRatio = 2;

function renderFrames(time: number): void {
  canvas.width = canvas.width;
  context.textAlign = 'center';
  context.fillText(
    `Hello There! ${Math.round(time)}`,
    canvas.width / centerRatio,
    canvas.height / centerRatio
  );
  window.requestAnimationFrame(renderFrames);
}

window.requestAnimationFrame(renderFrames);
