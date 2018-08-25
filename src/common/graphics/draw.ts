import { Vec2 } from '../vec2';

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
    return new Vec2(this.canvas.width / 2, this.canvas.height / 2);
  };

  // Render a circle with center position and radius.
  public readonly circle = (p: Vec2, r: number) => {
    this.ellipse(p, r, r);
  };

  // Render an ellipse given the center position, x radius, and y radius.
  public readonly ellipse = (p: Vec2, rx: number, ry: number) => {
    this.context.ellipse(p.x, p.y, rx, ry, 0, 0, 2 * Math.PI);
  };

  // Render a rectangle with upper left corner at the given position, width and
  // height.
  public readonly rect = (p: Vec2, w: number, h: number) => {
    this.context.rect(p.x, p.y, w, h);
  };

  // Render text at the given location.
  public readonly text = (
    text: string,
    p: Vec2,
    maxWidth?: number | undefined
  ) => {
    this.context.fillText(text, p.x, p.y, maxWidth);
  };
}
