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
  private prevTime = Infinity; // Set Infinity to designate first tick.

  public constructor() {
    this.entities = [];
    this.player = new Player();
    this.camera = new Camera();
    this.entities.push(this.player.entity);
    this.initializeLevel();
  }

  // Initialze world level state e.g. enemies and environment.
  public initializeLevel() {
    // TODO: Move to proper level loader / level config.
    // tslint:disable:no-magic-numbers
    this.entities.push(new Entity(new Vec2(300, 400), Vec2.zero()));
  }

  public handleInput() {
    // Zoom in / out.
    // A number greater than 1, determines how fast to zoom in / out.
    const zoomSpeed = 1.1;
    let zoomFactor = 1;
    const { isPressed } = state.input;
    if (isPressed('=')) {
      zoomFactor *= zoomSpeed;
    }
    if (isPressed('-')) {
      zoomFactor /= zoomSpeed;
    }
    this.camera.scale *= zoomFactor;
  }

  // Update this World's state given the game's current timestamp in seconds.
  public update(time: number) {
    // this.handleInput();

    // Don't update on the first tick.
    if (this.prevTime === Infinity) {
      this.prevTime = time;
      return;
    }
    // Get time delta in seconds.
    const delta = time - this.prevTime;

    // Perform updates.
    this.player.update();
    this.entities.forEach(entity => {
      entity.update(delta);
    });

    // So we know how much time has ellapsed between ticks.
    this.prevTime = time;
  }

  public render() {
    // this.camera.center = this.player.entity.position;
    // this.camera.apply();
    this.entities.forEach(entity => {
      entity.render();
    });
  }
}
