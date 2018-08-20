import { Vec2 } from '../../common/vec2';
import { Entity } from '../common/entity';

// TODO: disable this when the magic has been lost.
// tslint:disable:no-magic-numbers

// The game world.
export class World {
  public readonly entities: Entity[];
  public readonly player: Entity;

  constructor() {
    this.entities = [];
    this.player = new Entity(new Vec2(200, 200));
    this.entities.push(this.player);
  }

  public update = () => {
    this.entities.forEach(e => {
      e.update();
    });
  };

  public render = () => {
    this.entities.forEach(e => {
      e.render();
    });
  };
}
