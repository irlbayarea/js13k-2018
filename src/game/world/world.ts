import { MusicPlayer } from '../../common/audio/midi';
import { Camera } from '../../common/graphics/camera';
import { Entity } from './entity';
import { Player } from './player';

// The game world.
export class World {
  private readonly entities: Entity[];
  private readonly player: Player;
  private readonly camera: Camera;
  private readonly musicPlayer: MusicPlayer;
  private prevTime = Infinity; // Set Infinity to designate first tick.

  constructor() {
    this.entities = [];
    this.player = new Player();
    this.camera = new Camera();
    this.musicPlayer = new MusicPlayer();
    this.entities.push(this.player.entity);
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
    this.musicPlayer.update();
    this.player.update();
    this.entities.forEach(entity => {
      entity.update(delta);
    });

    // So we know how much time has ellapsed between ticks.
    this.prevTime = time;
  };

  public render = () => {
    this.camera.apply();
    this.entities.forEach(entity => {
      entity.render();
    });
  };
}
