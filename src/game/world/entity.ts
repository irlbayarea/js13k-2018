import { IDrawable } from '../../common/graphics/drawable';
import { Vec2 } from '../../common/math/vec2';
import { World } from './world';

// An entity in the world.
export class Entity {
  public readonly position: Vec2;
  public readonly velocity: Vec2;

  constructor(
    position: Vec2,
    velocity: Vec2,
    public readonly drawable: IDrawable
  ) {
    this.position = position.copy();
    this.velocity = velocity.copy();
  }

  public update() {
    this.position.addBy(Vec2.scale(this.velocity, World.TICK_DELTA));
  }

  public render() {
    this.drawable.render(this.position);
  }
}
