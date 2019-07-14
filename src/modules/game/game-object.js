import { Vector } from 'sylvester';
import { GameService } from '../../services/game-service';

class Transform {
    constructor() {
        this.position = Vector.create([0, 0, 0]);
        this.rotation = Vector.create([0, 0, 0]);
    }

    setPosition(x, y, z) {
        this.position = Vector.create([x, y, z]);
    }

    setRotation(x, y, z) {
        this.rotation = Vector.create([x, y, z]);
    }
}

class GameObject {
    constructor(baseInstance) {
        this.active = true;
        this.instance = baseInstance;
        this.transform = new Transform();
    }

    static instantiate(baseInstance) {
        return GameService.game.go.createGameObject(baseInstance);
    }
}

export { GameObject, Transform };