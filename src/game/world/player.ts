import { Vec2 } from '../../common/vec2';
import { Entity } from '../common/entity';

export class Player {
  public readonly entity: Entity;

  constructor() {
    // TODO: disable this when the magic has been lost.
    // tslint:disable-next-line:no-magic-numbers
    this.entity = new Entity(new Vec2(200, 200), new Vec2(20, 10));
  }

  public update() {
    // TODO: Handle input here.
    this.entity.p.x = this.entity.p.x;
  }
}
