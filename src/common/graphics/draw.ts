import { Vector } from '../math';

/**
 * The `Draw` class abstracts drawing to the canvas passed to the constructor.
 *
 * The caller still needs to set color and other properties using `fillStyle`
 * etc.
 */
export class Draw {
  public readonly canvas: HTMLCanvasElement;
  public readonly context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    canvas.width = FLAGS_DIMENSIONS.width;
    canvas.height = FLAGS_DIMENSIONS.height;

    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  // Clears the canvas.
  public readonly clear = () => {
    this.canvas.width = this.canvas.width;
  };

  // Return a Vec2 at the center of the canvas.
  public getCanvasCenter = () => {
    return new Vector(this.canvas.width / 2, this.canvas.height / 2);
  };

  // Render a circle with center position and radius.
  public readonly circle = (p: Vector, r: number) => {
    this.ellipse(p, r, r);
  };

  // Render an ellipse given the center position, x radius, and y radius.
  public readonly ellipse = (p: Vector, rx: number, ry: number) => {
    this.context.beginPath();
    this.context.ellipse(p.x, p.y, rx, ry, 0, 0, 2 * Math.PI);
    this.context.fill();
  };

  // Render a rectangle with upper left corner at the given position, width and
  // height.
  public readonly rect = (p: Vector, w: number, h: number) => {
    this.context.rect(p.x, p.y, w, h);
  };

  // Render text at the given location.
  public readonly text = (
    text: string,
    p: Vector,
    maxWidth?: number | undefined
  ) => {
    this.context.fillText(text, p.x, p.y, maxWidth);
  };
}
