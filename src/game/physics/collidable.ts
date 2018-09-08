import { Vec2 } from '../../common/math/vec2';

export class CircleCollidable {
  constructor(public readonly position: Vec2, public readonly radius: number) {}
}
