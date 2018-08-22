import { Entity } from '../common/entity';
import { Player } from './player';

// The game world.
export class World {
  public readonly entities: Entity[];
  public readonly player: Player;
  private prevTime: number;

  constructor() {
    this.entities = [];
    this.player = new Player();
    this.entities.push(this.player.entity);
    this.prevTime = Infinity; // Set so that we don't update on first tick.
  }

  // Update this World's state given the game's current timestamp in seconds.
  public update = (time: number) => {
    // Don't update on the first tick.
    if (this.prevTime === Infinity) {
      this.prevTime = time;
      return;
    }
    // Get time delta in seconds.
    const delta = time - this.prevTime;

    // Perform updates.
    this.entities.forEach(e => {
      e.update(delta);
    });
    this.player.update();

    // So we know how much time has ellapsed between ticks.
    this.prevTime = time;
  };

  public render = () => {
    this.entities.forEach(e => {
      e.render();
    });
  };
}
