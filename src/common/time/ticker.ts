import { logDebug } from '../logger';

/**
 * Game loop functionality for the engine.
 *
 * A consistent frame-rate can be better than a janky experience only
 * occassionally hitting 60fps. When we execute the @function update, we deduct
 * the last frame's execution time from the current time to see if the time
 * elapsed since the last frame is more than @see maxFps property or not.
 */
export class Ticker {
  /**
   * High performance timestamp of the previous frame.
   */
  private lastFrameTime = 0;

  /**
   * Pending @see window.requestAnimationFrame handle.
   */
  private animationRequest = 0;

  /**
   * Callbacks to be executed on every tick.
   */
  private onDeltaCallbacks: Array<(delta: number) => void> = [];

  /**
   * Creates a new ticker loop that invokes onTick.
   *
   * @param debugMode Whether to emit debug information to the console.
   */
  constructor(
    private readonly debugMode = !FLAGS_PRODUCTION
  ) {}

  /**
   * Starts (resumes) the game loop, if not already initialized.
   */
  public start(): void {
    if (!this.animationRequest) {
      this.requestNextFrame();
      this.lastFrameTime = window.performance.now();
      if (this.debugMode) {
        logDebug('Loop', 'Started');
      }
    }
  }

  /**
   * Stops (pauses) the game loop.
   */
  public stop(): void {
    if (this.animationRequest) {
      window.cancelAnimationFrame(this.animationRequest);
      this.animationRequest = this.lastFrameTime = 0;
      if (this.debugMode) {
        logDebug('Loop', 'Stopped');
      }
    }
  }

  /**
   * Subscribes to all updates by invoking the provided callback.
   * 
   * @param callback Invoked every frame with the time delta.
   */
  public subscribe(callback: (delta: number) => void) {
    this.onDeltaCallbacks.push(callback);
  }

  /**
   * Executes code as a result of the animation frame returning.
   */
  private onAnimationFrame = (current: number) => {
    const previous = this.lastFrameTime;
    const delta = Math.round(current - previous);
    this.runUpdateCallbacks(delta);
    this.requestNextFrame();
    this.lastFrameTime = window.performance.now();
  }

  /**
   * Executes all subscribed callback functions.
   * 
   * @param delta
   */
  private runUpdateCallbacks(delta: number): void {
    this.onDeltaCallbacks.forEach(e => e(delta));
  }

  private requestNextFrame(): void {
    this.animationRequest = window.requestAnimationFrame(
      this.onAnimationFrame
    );
  }
}
