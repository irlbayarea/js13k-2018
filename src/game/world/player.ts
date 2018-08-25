import { Vec2 } from '../../common/math/vec2';
import { state } from '../../index';
import { Entity } from './entity';

export class Player {
  public readonly entity: Entity;

  constructor() {
    // TODO: disable this when the magic has been lost.
    // tslint:disable-next-line:no-magic-numbers
    this.entity = new Entity(new Vec2(200, 200), Vec2.zero());
  }

  public update() {
    this.controls();
  }

  private controls() {
    // The new velocity is based on user input.
    const newVelocity = Vec2.zero();
    const { isPressed } = state.input;
    // const { isPressed } = state.input;
    if (isPressed('A')) {
      newVelocity.x -= 1;
    }
    if (isPressed('D')) {
      newVelocity.x += 1;
    }
    if (isPressed('W')) {
      newVelocity.y -= 1;
    }
    if (isPressed('S')) {
      newVelocity.y += 1;
    }
    // So player can't move diagonal faster than up and down
    if (newVelocity.lengthSquared() > 1) {
      newVelocity.normalize();
    }
    const speed = 250;
    newVelocity.scaleBy(speed);
    this.entity.velocity.set(newVelocity);
  }
}
