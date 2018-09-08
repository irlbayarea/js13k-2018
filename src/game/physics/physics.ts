import { Vec2 } from '../../common/math/vec2';
import { CircleCollidable } from './collidable';

export class Physics {
  private static interact(a: Body, b: Body) {
    const pa = a.physicsAttributes;
    const pb = b.physicsAttributes;
    if (pa.damageSupplier !== undefined && pb.damageConsumer !== undefined) {
      pa.damageSupplier!.damageYou(pb.damageConsumer);
    }
  }

  private readonly bodies: Body[] = [];

  public update() {
    this.handleCollisions();
  }

  public addBody(body: Body) {
    this.bodies.push(body);
  }

  private handleCollisions() {
    // This is O(n^2). Should be fine for now but this is the first place to
    // look if we get performance issues.
    this.bodies.forEach(a =>
      this.bodies.forEach(b => {
        if (a !== b) {
          const ca = a.circleCollidable;
          const cb = b.circleCollidable;
          const radiiSum = ca.radius + cb.radius;
          const minDistSq = radiiSum * radiiSum;
          if (Vec2.distanceSquared(ca.position, cb.position) <= minDistSq) {
            Physics.interact(a, b);
          }
        }
      })
    );
  }
}

export class Body {
  constructor(
    public readonly circleCollidable: CircleCollidable,
    public readonly physicsAttributes: IPhysicsAttributes
  ) {}
}

export interface IPhysicsAttributes {
  damageConsumer?: IDamageConsumer;
  damageSupplier?: IDamageSupplier;
}

export interface IDamageConsumer {
  damageMe: (amount: number) => void;
}

export interface IDamageSupplier {
  damageYou: (damageConsumer: IDamageConsumer) => void;
}
