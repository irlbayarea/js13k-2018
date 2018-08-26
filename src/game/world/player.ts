import { CircleDrawable } from '../../common/graphics/drawable';
import { Vec2 } from '../../common/math/vec2';
import { state } from '../../index';
import { Entity } from './entity';

export class Player {
  public readonly entity: Entity;

  constructor() {
    // TODO: disable this when the magic has been lost.
    const playerRadius = 20;
    // tslint:disable:no-magic-numbers
    const playerStartPosition = new Vec2(200, 200);
    this.entity = new Entity(
      playerStartPosition,
      Vec2.zero(),
      new CircleDrawable(playerRadius, 'blue')
    );
  }

  public update() {
    this.controls();
  }

  private controls() {
    // The new velocity is based on user input.
    const newVelocity = Vec2.zero();
    const { isPressed } = state.input;
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
