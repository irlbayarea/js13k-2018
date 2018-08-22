import { Vec2 } from '../../common/vec2';
import { Entity } from '../common/entity';

// The game world.
export class World {
  public readonly entities: Entity[];
  public readonly player: Entity;
  private prevTime: number;

  constructor() {
    this.entities = [];
    // TODO: disable this when the magic has been lost.
    // tslint:disable-next-line:no-magic-numbers
    this.player = new Entity(new Vec2(200, 200), new Vec2(0.01, 0.01));
    this.entities.push(this.player);
    this.prevTime = Infinity; // Set so that we don't update on first frame.
  }

  // Update this World's state given the game's current timestamp in milliseconds.
  public update = (time: number) => {
    if (this.prevTime === Infinity) {
      this.prevTime = time;
      return;
    }

    const delta = time - this.prevTime;

    this.entities.forEach(e => {
      e.update(delta);
    });

    this.prevTime = time;
  };

  public render = () => {
    this.entities.forEach(e => {
      e.render();
    });
  };
}
