import { CircleDrawable } from '../../common/graphics/drawable';
import { Vector } from '../../common/math';
import { state } from '../../index';
import { Entity } from './entity';

export class Player {
  private static readonly left = new Vector(-1, 0);
  private static readonly right = new Vector(1, 0);
  private static readonly up = new Vector(0, -1);
  private static readonly down = new Vector(0, 1);

  public readonly entity: Entity;

  constructor() {
    // TODO: disable this when the magic has been lost.
    const playerRadius = 20;
    // tslint:disable:no-magic-numbers
    const playerStartPosition = new Vector(200, 200);
    this.entity = new Entity(
      playerStartPosition,
      Vector.origin,
      new CircleDrawable(playerRadius, 'blue')
    );
  }

  public update() {
    this.controls();
  }

  private controls() {
    // The new velocity is based on user input.
    let newVelocity = Vector.origin;
    const { isPressed } = state.input;
    if (isPressed('A')) {
      newVelocity = newVelocity.add(Player.left);
    }
    if (isPressed('D')) {
      newVelocity = newVelocity.add(Player.right);
    }
    if (isPressed('W')) {
      newVelocity = newVelocity.add(Player.up);
    }
    if (isPressed('S')) {
      newVelocity = newVelocity.add(Player.down);
    }
    // So player can't move diagonal faster than up and down
    if (newVelocity.lengthSquared > 1) {
      newVelocity = newVelocity.scale(1 / newVelocity.length);
    }
    const speed = 250;
    newVelocity = newVelocity.scale(speed);
    this.entity.velocity = newVelocity;
  }
}
