import { Vec2 } from './vec2';

/**
 * Representing two-dimensional rectangles whose properties are immutable.
 */
export class Rectangle {
  constructor(
    /**
     * Width of the rectangle.
     */
    public readonly width: number,
    /**
     * Height of the rectangle.
     */
    public readonly height: number,
    /**
     * X-position of the rectangle.
     */
    public readonly left: number,
    /**
     * Y-position of the rectangle.
     */
    public readonly top: number
  ) {}

  /**
   * Bottom position of the rectangle.
   */
  public get bottom(): number {
    return this.top + this.height;
  }

  public get bottomLeft(): Vec2 {
    return new Vec2(this.left, this.bottom);
  }

  public get bottomRight(): Vec2 {
    return new Vec2(this.right, this.bottom);
  }

  public get topLeft(): Vec2 {
    return new Vec2(this.left, this.top);
  }

  public get topRight(): Vec2 {
    return new Vec2(this.right, this.top);
  }

  /**
   * Right position of the rectangle.
   */
  public get right(): number {
    return this.left + this.width;
  }

  /**
   * Returns {true} if {this} intersects {other}.
   *
   * @param other
   */
  public intersects(other: Rectangle): boolean {
    return (
      this.left <= other.left + other.width &&
      other.left <= this.left + this.width &&
      this.top <= other.top + other.height &&
      other.top <= this.top + this.height
    );
  }
}

/**
 * Returns a random number with a maximum of {lowOrHigh}.
 *
 * If {high} is specified, returns a number between {lowOrHigh} and {high}.
 *
 * @param lowOrHigh
 * @param high
 */
export function random(lowOrHigh: number, high?: number): number {
  let low = lowOrHigh;
  if (!high) {
    high = lowOrHigh;
    low = 0;
  }
  return Math.floor(Math.random() * Math.floor(high)) + low;
}
