import { Vec2 } from '../../common/vec2';
import { state } from '../../index';

const defaultWidth = 100;

// An entity in the world.
export class Entity {
  public readonly p: Vec2;
  public readonly v: Vec2;
  public readonly r: number;

  constructor(p: Vec2, v: Vec2 = Vec2.zero()) {
    this.p = p;
    this.v = v;
    this.r = defaultWidth;
  }

  public update() {
    this.p.addBy(this.v);
  }

  public render() {
    state.draw.circle(this.p, this.r);
    state.draw.context.fillStyle = 'red';
    state.draw.context.fill();
  }
}
