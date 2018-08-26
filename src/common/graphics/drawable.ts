import { state } from '../../index';
import { Vector } from '../math';
// import { Sprite } from './sprite';

/**
 * IDrawable: specifies that things can be rendered.
 */
export interface IDrawable {
  render(position: Vector): void;
}

/**
 * Drawable Circle.
 */
export class CircleDrawable implements IDrawable {
  /**
   * @param radius
   * @param style E.g. 'red'.
   */
  constructor(
    private readonly radius: number,
    private readonly style: string
  ) {}

  public render(position: Vector) {
    state.draw.context.fillStyle = this.style;
    state.draw.circle(position, this.radius);
  }
}

/**
 * Drawable Sprite.
 */
// export class SpriteDrawable implements IDrawable {
//   constructor(private readonly sprite: Sprite, private readonly width: number) {
//     // TODO: delete this
//     this.sprite.render(Vec2.zero(), 2);
//   }
//   public render(position: Vec2) {
//     // TODO: render a sprite
//     state.draw.context.fillStyle = 'violet';
//     state.draw.circle(position, this.width / 2);
//   }
// }
