import { state } from '../../index';
import { Vec2 } from '../math/vec2';

export class Camera {
  public static readonly defaultPosition = Vec2.zero();
  public static readonly defaultScale = 1;
  public static readonly defaultRotation = 0;

  public center = Camera.defaultPosition;
  public scale = Camera.defaultScale;
  public rotation = Camera.defaultRotation;

  public apply() {
    const context = state.draw.context;
    context.resetTransform();
    // First translate so that the center is at the origin.
    context.translate(-this.center.x, -this.center.y);
    // context.scale(this.scale, this.scale);
    // context.rotate(this.rotation);
    // Translate the object back to the center of the canvas.
    const canvasCenter = state.draw.getCanvasCenter();
    context.translate(canvasCenter.x, canvasCenter.y);
  }
}
