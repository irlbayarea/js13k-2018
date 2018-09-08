/**
 * The Vec2 class represents a mutable 2D vector. This class holds a fully-featured and performant
 * suite of properties and operators for two dimensional vectors.
 *
 * All static functions are non-mutating. All mutators are instance methods and do not return a
 * value.
 *
 * @author Alexander J. Kindel <alexkindel@gmail.com>
 * @license MIT
 */
export class Vec2 {
  // --- Static Properties --- //

  /**
   * Returns the distance between two vectors, treated as points.
   */
  public static distance(a: Vec2, b: Vec2): number {
    const xd = a.x - b.x;
    const yd = a.y - b.y;
    return Math.sqrt(xd * xd + yd * yd);
  }

  /**
   * Returns the squared distance between two vectors, treated as points.
   */
  public static distanceSquared(a: Vec2, b: Vec2): number {
    const xd = a.x - b.x;
    const yd = a.y - b.y;
    return xd * xd + yd * yd;
  }

  /**
   * Returns the angle in radians between two vectors. The angle will be in the range [-PI, PI].
   *
   * Specifically, returns the smallest (closest to zero) angle that the first vector may be
   * rotated by to face the second.
   */
  public static angleBetween(a: Vec2, b: Vec2): number {
    // atan2(y: cross product as taken in 3D, x: dot product).
    // Can get close from trig identities like this: https://i.imgur.com/nkpUC6I.png
    return Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y);
  }

  /**
   * Calculates the scalar projection of the first vector onto the second.
   *
   * https://en.wikipedia.org/wiki/Scalar_projection
   */
  public static scalarProjection(a: Vec2, b: Vec2): number {
    return Vec2.dot(a, Vec2.normal(b));
  }

  /**
   * Returns the vector projection of one vector onto another.
   *
   * https://en.wikipedia.org/wiki/Vector_projection
   */
  public static projection(a: Vec2, b: Vec2): Vec2 {
    // This is the simplification of projection if you expand out the definition.
    // It is b * (a dot b) / ||b||^2, where ||b|| is the length of b.
    const s: number = (a.x * b.x + a.y * b.y) / (b.x * b.x + b.y * b.y);
    return new Vec2(b.x * s, b.y * s);
  }

  /**
   * Returns the reflection of a vector about a line normal given by the line normal's angle. You
   * can imagine this function as returning the velocity vector of a ball after bouncing off a wall
   * defined by the angle of its surface normal.
   */
  public static reflectionAboutLineNormalAngle(
    v: Vec2,
    lineNormalAngle: number
  ): Vec2 {
    const nx: number = Math.cos(lineNormalAngle);
    const ny: number = Math.sin(lineNormalAngle);
    const d: number = 2 * (v.x * nx + v.y * ny);
    return new Vec2(v.x - d * nx, v.y - d * ny);
  }

  // --- Static Operators --- //

  /**
   * Returns a new vector that is the result of vector addition.
   */
  public static add(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x + b.x, a.y + b.y);
  }

  /**
   * Returns a new vector that is the result of vector subtraction.
   */
  public static subtract(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x - b.x, a.y - b.y);
  }

  /**
   * Returns a new vector that is the result of vector scaling.
   */
  public static scale(v: Vec2, s: number): Vec2 {
    return new Vec2(v.x * s, v.y * s);
  }

  /*
   * Returns a new vector with components that have been divided by a scalar.
   */
  public static divide(v: Vec2, s: number): Vec2 {
    return new Vec2(v.x / s, v.y / s);
  }

  /**
   * Returns a new vector that is negated (that is, reversed).
   */
  public static negated(v: Vec2): Vec2 {
    return new Vec2(-v.x, -v.y);
  }

  /**
   * Returns a new normalized vector.
   */
  public static normal(v: Vec2): Vec2 {
    const result: Vec2 = v.copy();
    result.normalize();
    return result;
  }

  /**
   * Returns the dot product.
   */
  public static dot(a: Vec2, b: Vec2): number {
    return a.x * b.x + a.y * b.y;
  }

  /**
   * Returns a new vector that is the result of rotating the given vector by the given angle.
   */
  public static rotated(v: Vec2, angle: number): Vec2 {
    const result: Vec2 = v.copy();
    v.rotateBy(angle);
    return result;
  }

  /**
   * Returns a new vector that is a vector clamped inside a rectangle given by two points. The
   * points of the rectangle do not have to be given in any specific order.
   */
  public static clampedToRectangle(v: Vec2, r1: Vec2, r2: Vec2): Vec2 {
    const ulx: number = Math.min(r1.x, r2.x);
    const uly: number = Math.min(r1.y, r2.y);
    const brx: number = Math.max(r1.x, r2.x);
    const bry: number = Math.max(r1.y, r2.y);

    return new Vec2(
      Math.max(Math.min(v.x, brx), ulx),
      Math.max(Math.min(v.y, bry), uly)
    );
  }

  // --- Factory Functions --- //

  /**
   * Returns a new zero vector (0, 0).
   */
  public static zero(): Vec2 {
    return new Vec2(0, 0);
  }

  /**
   * Returns a new vector with the given angle and length.
   */
  public static createAngleLength(angle: number, length: number): Vec2 {
    return new Vec2(Math.cos(angle) * length, Math.sin(angle) * length);
  }

  /**
   * Returns a new unit vector with the given angle.
   */
  public static createUnit(angle: number): Vec2 {
    return new Vec2(Math.cos(angle), Math.sin(angle));
  }

  /**
   * Returns a new unit vector with a random angle.
   */
  public static createRandomUnit(): Vec2 {
    const angle: number = Math.random() * Math.PI * 2;
    return Vec2.createUnit(angle);
  }

  /**
   * Returns a new vector that is the result of linearly interpolating between the two argument
   * vectors.
   *
   * @param {Vec2} v1 The vector to interpolate from.
   * @param {Vec2} v2 The vector to interpolate to.
   * @param {number} a The interpolation distance. May be any real number. A value of 0 returns
   *                   the first vector argument, a value of 1 returns the second.
   */
  public static lerp(v1: Vec2, v2: Vec2, a: number): Vec2 {
    return new Vec2(a * v2.x + (1 - a) * v1.x, a * v2.y + (1 - a) * v1.y);
  }

  /**
   * Returns a new vector from a number array that has at least two elements.
   */
  public static fromArray(arr: number[]): Vec2 {
    return new Vec2(arr[0], arr[1]);
  }

  // --- Fields --- //

  public x: number;
  public y: number;

  // --- Constructor --- //

  /**
   * Constructs a new vector with the given coordinates.
   */
  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Returns a copy of this vector.
   */
  public copy(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  // --- Comparisons --- //

  /**
   * Returns whether this vector equals another. Warning: due to the nature of floating-point, you
   * may want to use equalsEpsilon instead.
   */
  public equals(v: Vec2): boolean {
    return this.x === v.x && this.y === v.y;
  }

  /**
   * Returns whether the vectors are within epsilon of each other (by distance).
   */
  public equalsEpsilon(v: Vec2, epsilon: number): boolean {
    return Vec2.distanceSquared(this, v) <= epsilon * epsilon;
  }

  // --- Properties --- //

  /**
   * Returns the x-coordinate rounded down to the nearest integer.
   */
  public ix(): number {
    return Math.floor(this.x);
  }

  /**
   * Returns the y-coordinate rounded down to the nearest integer.
   */
  public iy(): number {
    //noinspection JSSuspiciousNameCombination
    return Math.floor(this.y);
  }

  /**
   * Returns the length of this vector.
   */
  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Returns the squared length of this vector.
   */
  public lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Returns the angle in radians of this vector from the x-axis.
   */
  public angle(): number {
    return Math.atan2(this.y, this.x);
  }

  // --- Setters (Completely replaces vector) --- //

  /**
   * Sets this vector equal to another, overwriting this vector.
   */
  public set(v: Vec2) {
    this.x = v.x;
    this.y = v.y;
  }

  /**
   * Sets this vector equal to another given by angle and length, overwriting this vector.
   */
  public setAngleLength(angle: number, length: number) {
    this.x = Math.cos(angle) * length;
    this.y = Math.sin(angle) * length;
  }

  /**
   * Sets this vector to a unit vector given by angle, overwriting this vector.
   */
  public setUnit(angle: number) {
    this.x = Math.cos(angle);
    this.y = Math.sin(angle);
  }

  // --- Mutating Operators --- //

  /**
   * Adds to this vector by the given vector.
   */
  public addBy(v: Vec2) {
    this.x += v.x;
    this.y += v.y;
  }

  /**
   * Subtracts from this vector by the given vector.
   */
  public subtractBy(v: Vec2) {
    this.x -= v.x;
    this.y -= v.y;
  }

  /**
   * Scales (multiply) the length of this number by the given value.
   */
  public scaleBy(s: number) {
    this.x *= s;
    this.y *= s;
  }

  /**
   * Divides the length of this vector by the given value.
   */
  public divideBy(s: number) {
    this.x /= s;
    this.y /= s;
  }

  /**
   * Negates (reverses) this vector.
   */
  public negate() {
    this.x = -this.x;
    this.y = -this.y;
  }

  /**
   * Normalizes this vector.
   */
  public normalize() {
    const length = this.length();
    this.divideBy(length);
  }

  /**
   * Rotates this vector by the given angle in radians. Values between 0 and 2pi rotate clockwise
   * by that amount.
   */
  public rotateBy(angle: number) {
    const c: number = Math.cos(angle);
    const s: number = Math.sin(angle);

    const nx: number = c * this.x - s * this.y;
    this.y = s * this.x + c * this.y;
    this.x = nx;
  }

  /**
   * Rotates this vector clockwise by 90 degrees (if +y is up and +x is right).
   */
  public rotateClockwise90() {
    const temp: number = this.x;
    this.x = this.y;
    this.y = -temp;
  }

  /**
   * Rotates this vector counterclockwise by 90 degrees (if +y is up and +x is right).
   */
  public rotateCounterclockwise90() {
    const temp: number = this.x;
    this.x = -this.y;
    this.y = temp;
  }

  /**
   * Extends the length of this vector by the argument.
   */
  public extend(length: number) {
    const a: number = length / this.length();
    this.x += this.x * a;
    this.y += this.y * a;
  }

  /**
   * Sets the angle of this vector, preserving length.
   */
  public setAngle(angle: number) {
    const length = this.length();
    this.x = length * Math.cos(angle);
    this.y = length * Math.cos(angle);
  }

  /**
   * Sets the length of this vector, preserving angle.
   */
  public setLength(length: number) {
    const a: number = length / this.length();
    this.x *= a;
    this.y *= a;
  }

  // --- Other --- //

  /**
   * Returns a new array consisting of the components of this vector.
   */
  public toArray(): number[] {
    return [this.x, this.y];
  }

  /**
   * Returns a string representation of this vector in the form "(0, 0)".
   */
  public toString(): string {
    return '(' + this.x.toString() + ', ' + this.y.toString() + ')';
  }

  /**
   * Returns a string representation of this vector in the form "(0.001, 0.001)", with the given
   * number of decimal places.
   */
  public toStringFixed(n: number): string {
    return '(' + this.x.toFixed(n) + ', ' + this.y.toFixed(n) + ')';
  }
}
