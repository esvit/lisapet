import GameObject from './GameObject.mjs';
import { PHYSICS_COLLISION_DISPLACE } from '../physics/PhysicsEntity.mjs';

export default
class Player extends GameObject {
  constructor([x, y, width, height], options = {}) {
    super({
      x, y, width, height,
      collisionType: PHYSICS_COLLISION_DISPLACE,
      ...options
    });
  }

  async loading() {

  }

  draw() {

  }
}
