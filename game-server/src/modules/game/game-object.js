import _ from 'lodash';
import { Vector } from 'sylvester';

class Transform {
    constructor(gameObject) {
        this.go = gameObject;
        this.velocity = 0;
        this.position = Vector.create([0, 0, 0]);
        this.rotation = Vector.create([0, 0, 0]);
    }

    getWorldPosition() {
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

    serialize() {
        return {
            velocity: this.velocity,
            worldPosition: this.getWorldPosition(),
            localPosition: this.position,
            rotation: this.rotation
        };
    }
}

class GameObject {
    constructor(service, baseInstance = null, parent = null) {
        const t = (baseInstance !== null && baseInstance.constructor ? baseInstance.constructor.name : 'gameobject');
        this.name = _.uniqueId(`${_.snakeCase(t)}_`);
        this.active = true;
        this.transform = new Transform(this);
        this.service = service;
        this.instance = baseInstance;
        this.parent = parent;
    }

    destroy() {
        this.service.destroyGameObject(this);
    }

    serialize() {
        return {
            gameObjectID: this.ID,
            serverID: this.service.gameServer.ID,
            name: this.name,
            active: this.active,
            transform: this.transform.serialize()
        };
    }
}

export { GameObject, Transform };