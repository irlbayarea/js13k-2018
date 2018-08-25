import { Vec2 } from '../../common/math/vec2';
import { state } from '../../index';

const defaultRadius = 20;

// An entity in the world.
export class Entity {
  public readonly position: Vec2;
  public readonly velocity: Vec2;
  public readonly radius: number;

  constructor(position: Vec2, velocity: Vec2 = Vec2.zero()) {
    this.position = position;
    this.velocity = velocity;
    this.radius = defaultRadius;
  }

  public update(delta: number) {
    this.position.addBy(Vec2.scale(this.velocity, delta));
  }

  public render() {
    state.draw.circle(this.position, this.radius);
    state.draw.context.fillStyle = 'red';
    state.draw.context.fill();
  }
}
