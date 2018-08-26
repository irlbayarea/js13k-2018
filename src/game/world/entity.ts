import { IDrawable } from '../../common/graphics/drawable';
import { Vector } from '../../common/math';
import { World } from './world';

// An entity in the world.
export class Entity {
  constructor(
    public position: Vector,
    public velocity: Vector,
    public readonly drawable: IDrawable
  ) {}

  public update() {
    this.position.add(this.velocity.scale(World.TICK_DELTA));
  }

  public render() {
    this.drawable.render(this.position);
  }
}
