/**
 * Time representing "1 second" in milliseconds.
 */
export const aSecondInMs = 1000;

/**
 * Frames normally requested per second by @see window.requestAnimationFrame.
 */
export const framesPerSecond = 60;

/**
 * Manages the concept of time for game mechanics and rendering/processing.
 *
 * Eventually will encapsulate the following:
 * - Scheduled events.
 * - Custom timers and steppers.
 */
export class Timer {
  private readonly callbacks: Array<(time: number) => void> = [];

  /**
   * Updates the timer with the current time, and executes all timing events.
   *
   * @param time
   */
  public update = (time: number) => {
    this.callbacks.forEach(e => e(time));
  };

  /**
   * Subscribers to all updates by invoking the provided callback.
   *
   * @param callback
   */
  public subscribe = (callback: (time: number) => void): void => {
    this.callbacks.push(callback);
  };
}
