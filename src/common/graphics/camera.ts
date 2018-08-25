import { state } from '../../index';
import { Vec2 } from '../math/vec2';

export class Camera {
  public static readonly defaultPositionSupplier = Vec2.zero;
  public static readonly defaultScale = 1;
  public static readonly defaultRotation = 0;

  public center = Camera.defaultPositionSupplier();
  public scale = Camera.defaultScale;
  public rotation = Camera.defaultRotation;

  public apply() {
    const context = state.draw.context;
    context.resetTransform();
    context.translate(this.center.x, this.center.y);
    context.scale(this.scale, this.scale);
    context.rotate(this.rotation);
  }
}
