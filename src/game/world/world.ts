import { MusicPlayer } from '../../common/audio/midi';
import { Camera } from '../../common/graphics/camera';
import { Vec2 } from '../../common/math/vec2';
import { state } from '../../index';
import { Entity } from './entity';
import { Player } from './player';

// The game world.
export class World {
  private readonly entities: Entity[];
  private readonly player: Player;
  private readonly camera: Camera;
  private readonly musicPlayer: MusicPlayer;
  private prevTime = Infinity; // Set Infinity to designate first tick.

  public constructor() {
    this.entities = [];
    this.player = new Player();
    this.camera = new Camera();
    this.musicPlayer = new MusicPlayer();
    this.entities.push(this.player.entity);
    this.initializeLevel();
  }

  // Initialze world level state e.g. enemies and environment.
  public initializeLevel() {
    // TODO: Move to proper level loader / level config.
    // tslint:disable-next-line:no-magic-numbers
    this.entities.push(new Entity(new Vec2(300, 400), Vec2.zero()));
    // tslint:disable-next-line:no-magic-numbers
    this.entities.push(new Entity(new Vec2(360, 460), Vec2.zero()));
    // tslint:disable-next-line:no-magic-numbers
    this.entities.push(new Entity(new Vec2(100, 250), Vec2.zero()));
    // tslint:disable-next-line:no-magic-numbers
    this.entities.push(new Entity(new Vec2(500, 150), Vec2.zero()));
  }

  // Update this World's state given the game's current timestamp in seconds.
  public update(time: number) {
    // Don't update on the first tick.
    if (this.prevTime === Infinity) {
      this.prevTime = time;
      return;
    }
    // Get time delta in seconds.
    const delta = time - this.prevTime;
    this.handleCameraInput();

    // Perform updates.
    this.musicPlayer.update();
    this.player.update();
    this.entities.forEach(entity => {
      entity.update(delta);
    });

    // So we know how much time has ellapsed between ticks.
    this.prevTime = time;
  }

  public render() {
    this.camera.center = this.player.entity.position;
    this.camera.apply();
    this.entities.forEach(entity => {
      entity.render();
    });
  }

  // Handles zoom in / out input.
  private handleCameraInput() {
    const { isPressed } = state.input;
    if (isPressed('=')) {
      this.camera.zoom(true);
    }
    if (isPressed('-')) {
      this.camera.zoom(false);
    }
    if (isPressed(']')) {
      // tslint:disable-next-line:no-magic-numbers
      this.camera.rotation -= Math.PI / 100;
    }
    if (isPressed('[')) {
      // tslint:disable-next-line:no-magic-numbers
      this.camera.rotation += Math.PI / 100;
    }
  }
}
