import { Vec2 } from '../../common/vec2';
import { state } from '../../index';
import { Entity } from '../common/entity';

export class Player {
  public readonly entity: Entity;

  constructor() {
    // TODO: disable this when the magic has been lost.
    // tslint:disable-next-line:no-magic-numbers
    this.entity = new Entity(new Vec2(200, 200), new Vec2(0, 0));
  }

  public update() {
    this.controls();
  }

  private controls() {
    // The new velocity is based on user input.
    const v = new Vec2(0, 0);
    if (state.input.isPressed('A')) {
      v.x -= 1;
    }
    if (state.input.isPressed('D')) {
      v.x += 1;
    }
    if (state.input.isPressed('W')) {
      v.y -= 1;
    }
    if (state.input.isPressed('S')) {
      v.y += 1;
    }
    // So player can't move diagonal faster than up and down
    if (v.lengthSquared() > 1) {
      v.normalize();
    }
    const speed = 250;
    v.scaleBy(speed);
    this.entity.v.set(v);
  }
}
