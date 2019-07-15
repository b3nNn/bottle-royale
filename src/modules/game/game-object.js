import _ from 'lodash';
import { Vector } from 'sylvester';
import { GameService } from '../../services/game-service';

class Transform {
    constructor(gameObject) {
        this.go = gameObject;
        this.velocity = 0;
        this.position = Vector.create([0, 0, 0]);
        this.rotation = Vector.create([0, 0, 0]);
    }

    getPosition() {
        if (this.go.parent) {
            return this.go.parent.transform.position.add(this.position);
        } else {
            return this.position;
        }
    }

    setPosition(x, y, z) {
        this.position = Vector.create([x, y, z]);
    }

    setRotation(x, y, z) {
        this.rotation = Vector.create([x, y, z]);
    }
}

class GameObject {
    constructor(baseInstance = null, parent = null) {
        const t = (baseInstance !== null && baseInstance.constructor ? baseInstance.constructor.name : 'gameobject');
        this.name = _.uniqueId(`${_.snakeCase(t)}_`);
        this.active = true;
        this.transform = new Transform(this);
        this.instance = baseInstance;
        this.parent = parent;
        console.log('GAMEOBJECT', baseInstance, t, this.name);
    }

    static instantiate(baseInstance) {
        return GameService.game.go.createGameObject(baseInstance);
    }
}

export { GameObject, Transform };