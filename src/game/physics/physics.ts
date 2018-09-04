import { CircleCollidable } from './collidable';

class CollisionGroup {
  public readonly collidables: CircleCollidable[];

  constructor() {
    this.collidables = [];
  }
}

class Projectile {
  constructor(public readonly circleCollidable: CircleCollidable) {}
}

export class Physics {
  private readonly groups: Map<string, CollisionGroup>;
  private readonly interactions: Map<string, Set<string>>;

  constructor() {
    this.groups = new Map();
    this.interactions = new Map();
  }

  // public addGroup(name: string) {}

  // public addInteraction(fromGroup: string, toGroup: string) {}

  // public update() {}

  // private processCollisions() {}
}

// notes
// collision between group A and group B.
// e.g. players and bullets
// groups must have a particular type and a way of getting the associated
// object of that type from the collidable entity on collision.

// have specific groups like bullet group, and its targets. the targets
// will provide a handler for the group. The group will require objects of
// type e.g. bullet
