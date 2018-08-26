import { state } from '../../index';
import { Vec2 } from '../math/vec2';
// import { Sprite } from './sprite';
import { Sprite } from './sprites';

/**
 * IDrawable: specifies that things can be rendered.
 */
export interface IDrawable {
  render(position: Vec2): void;
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

  public render(position: Vec2) {
    state.draw.context.fillStyle = this.style;
    state.draw.circle(position, this.radius);
  }
}

/**
 * Drawable Sprite.
 */
export class SpriteDrawable implements IDrawable {
  constructor(
    private readonly sprite: Sprite,
    private readonly width: number
  ) {}

  public render(position: Vec2) {
    // TODO draw the sprite
    state.draw.context.fillStyle = 'violet';
    state.draw.circle(position, this.width / 2);
    this.sprite.render(position, this.width);
  }
}
