import { spriteSheet } from '../../assets/sprite-listing';
import { AudioHandler } from '../../common/audio/audio';
import { Camera } from '../../common/graphics/camera';
import { CircleDrawable, SpriteDrawable } from '../../common/graphics/drawable';
import { Sprite } from '../../common/graphics/sprites';
import { Rectangle } from '../../common/math/math';
import { Vec2 } from '../../common/math/vec2';
import { state } from '../../index';
import { Entity } from './entity';
import { Player } from './player';

/**
 * The game world. Holds world state and update logic.
 *
 * Important concepts:
 *  - Time vs Delta time: Time is a wall clock time, from some epoch. Delta time
 *    is the difference between two wall clock times.
 *  - Updating and Rendering: The world is updated and then displayed.
 *  - World `update` vs World `tick`: Each world update may consist of zero or
 *    more ticks. See description of TIME_DELTA.
 */
export class World {
  /**
   * TICK_DELTA is the world tick time ("delta time") in seconds.
   *
   * In a nutshell, this allows all update logic to assume that they are run an
   * exact number of times per second.
   *
   * The world runs fewer or greater ticks of this delta time depending on how
   * often `update` is called. Updating in this way makes update logic simpler
   * and more robust at the cost of tick flexibility. Some world update logic is
   * difficult to integrate over variable delta times, so this value ensures
   * that all updates are over the same delta.
   *
   * The value should be small enough to avoid noticeable jitteriness, and large
   * enough to avoid performance issues.
   */
  // tslint:disable-next-line:no-magic-numbers
  public static readonly TICK_DELTA = 1 / 180;
  /**
   * The maximum time in seconds an update is allowed to process. This prevents
   * the game from going haywire when there are performance issues and/or when
   * the browser process was not running for some time.
   */
  private static readonly MAX_UPDATE_TIME = 0.25;
  private readonly entities: Entity[];
  private readonly player: Player;
  private readonly camera: Camera;
  private readonly musicPlayer: AudioHandler;
  /**
   * Set Infinity to designate first tick.
   */
  private prevTime = Infinity;
  /**
   * Accumulates real-world time and is "eaten" by updates. A tick runs when
   * this value reaches zero. See also `TICK_DELTA`.
   */
  private updateTimePool = 0;

  public constructor() {
    this.entities = [];
    this.player = new Player();
    this.camera = new Camera();
    this.musicPlayer = new AudioHandler();
    this.entities.push(this.player.entity);
    this.initializeLevel();
  }

  /**
   * Initialze world level state e.g. enemies and environment.
   */
  public initializeLevel() {
    // TODO: Move to proper level loader / level config.
    // tslint:disable:no-magic-numbers
    const randoEntityMaker = (position: Vec2) =>
      new Entity(position, Vec2.zero(), new CircleDrawable(10, 'red'));
    this.entities.push(randoEntityMaker(new Vec2(300, 400)));
    this.entities.push(randoEntityMaker(new Vec2(360, 460)));
    this.entities.push(randoEntityMaker(new Vec2(100, 250)));
    this.entities.push(randoEntityMaker(new Vec2(500, 150)));

    const testSprite = new Sprite(spriteSheet, new Rectangle(16, 16, 16, 16));
    this.entities.push(
      new Entity(
        new Vec2(100, 100),
        Vec2.zero(),
        new SpriteDrawable(testSprite, 16)
      )
    );
  }

  /**
   * Update this World's state given the game's current timestamp in seconds.
   */
  public update(time: number) {
    // Don't update on the first call, treat it as the start of world time.
    if (this.prevTime === Infinity) {
      this.prevTime = time;
      return;
    }

    // Get time delta in seconds.
    const delta = Math.min(time - this.prevTime, World.MAX_UPDATE_TIME);
    this.updateTimePool += delta;

    // "tick" until caught up with real-world time. See `TICK_DELTA`.
    while (this.updateTimePool >= 0) {
      this.updateTimePool -= World.TICK_DELTA;
      this.tick();
    }

    // So we know how much time has ellapsed between ticks.
    this.prevTime = time;
  }

  /**
   * Renders the world.
   */
  public render() {
    this.camera.center = this.player.entity.position;
    this.camera.apply();
    this.entities.forEach(entity => {
      entity.render();
    });
  }

  /**
   * Update the world with the given delta in seconds. Note that some updates
   * are poorly parametarized according to the delta, see `World.TICK_DELTA`.
   */
  private tick() {
    this.musicPlayer.update();
    this.handleCameraInput();
    this.player.update();
    this.entities.forEach(entity => {
      entity.update();
    });
  }

  /**
   * Handles camera inputs.
   */
  private handleCameraInput() {
    const { isPressed } = state.input;
    if (isPressed('=')) {
      this.camera.updateZoom(true);
    }
    if (isPressed('-')) {
      this.camera.updateZoom(false);
    }
    // tslint:disable-next-line:no-magic-numbers
    if (isPressed(']')) {
      this.camera.updateRotation(true);
    }
    if (isPressed('[')) {
      // tslint:disable-next-line:no-magic-numbers
      this.camera.updateRotation(false);
    }
  }
}
