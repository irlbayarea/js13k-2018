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

  public get bottomLeft(): Vector {
    return new Vector(this.left, this.bottom);
  }

  public get bottomRight(): Vector {
    return new Vector(this.right, this.bottom);
  }

  public get topLeft(): Vector {
    return new Vector(this.left, this.top);
  }

  public get topRight(): Vector {
    return new Vector(this.right, this.top);
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
 * 2-dimensional immutable vector in a scalar coordinate system.
 */
export class Vector {
  /**
   * Represents the "0, 0" coordinate.
   */
  public static readonly origin = new Vector(0, 0);

  constructor(
    /**
     * X-position of the point.
     */
    public readonly x: number,
    /**
     * Y-position of the point.
     */
    public readonly y: number
  ) {}

  public add(x: number, y: number): Vector;
  public add(other: Vector): Vector;

  /**
   * Returns the result of this and another vector added together.
   *
   * @param other
   */
  public add(otherOrX: Vector | number, y?: number): Vector {
    if (typeof otherOrX === 'number') {
      return this.addBy(otherOrX, y!);
    }
    return this.addBy(otherOrX.x, otherOrX.y);
  }

  /**
   * Returns whether this point is equivalent to the provided one.
   *
   * @param other
   */
  public equals(other: Vector): boolean {
    return this.x === other.x && this.y === other.y;
  }

  /**
   * Length of this vector.
   */
  public get length(): number {
    return Math.sqrt(this.lengthSquared);
  }

  /**
   * Squared length of this vector.
   */
  public get lengthSquared(): number {
    const x = this.x;
    const y = this.y;
    return x * x + y * y;
  }

  /**
   * Returns a new vector scaled by the provided value.
   *
   * @param factor
   */
  public scale(factor: number): Vector {
    return new Vector(this.x * factor, this.y * factor);
  }

  private addBy(x: number, y: number): Vector {
    return new Vector(this.x + x, this.y + y);
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
