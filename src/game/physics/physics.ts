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
    this.bodies.forEach(a =>
      this.bodies.forEach(b => {
        if (a !== b) {
          const ca = a.circleCollidable;
          const cb = b.circleCollidable;
          let l2 = ca.radius + cb.radius;
          l2 *= l2;
          if (Vec2.distanceSquared(ca.position, cb.position) <= l2) {
            Physics.interact(a, b);
          }
        }
      })
    );
  }
}

class Body {
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
