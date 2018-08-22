import { Vec2 } from '../../common/vec2';
import { state } from '../../index';

const defaultWidth = 100;

// An entity in the world.
export class Entity {
  public readonly p: Vec2; // Position
  public readonly v: Vec2; // Velocity
  public readonly r: number; // Radius

  constructor(p: Vec2, v: Vec2 = Vec2.zero()) {
    this.p = p;
    this.v = v;
    this.r = defaultWidth;
  }

  public update(delta: number) {
    this.p.addBy(Vec2.scale(this.v, delta));
  }

  public render() {
    state.draw.circle(this.p, this.r);
    state.draw.context.fillStyle = 'red';
    state.draw.context.fill();
  }
}
