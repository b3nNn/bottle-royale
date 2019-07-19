import _ from 'lodash';
import { GameObject } from '../modules/game/game-object';
import ClockTick from '../components/clock-tick';
import { Seconds, toSeconds, toMilliseconds } from '../modules/game/time';
import Vehicule from '../modules/game/vehicule';

class GameObjectService {
    constructor(collections) {
        this.gameServer;
        this.sceneActives = [];
        this.collections = collections;
        this.debugTick = new ClockTick(toSeconds(5));
        this.transformUpdateTick = new ClockTick(toMilliseconds(1000 / 3));
    }

    configure(config) {
        this.debug = config.debug;
    }

    init(gameServer) {
        this.gameServer = gameServer;
    }

    createGameObject(baseInstance) {
        const go = new GameObject(this, baseInstance);
        go.ID = this.collections('game').uid('game.game_object');
        this.collections('game').push('game_object', {
            serverID: this.gameServer.ID,
            gameObjectID: go.ID,
            gameObject: go
        });
        this.sceneActives.push(go);
        baseInstance.gameObject = go;
        return go;
    }

    instanciate(baseInstance) {
        return this.createGameObject(baseInstance);
    }

    update(time) {
        _.each(this.collections('game').filter('game_object', go => go.gameObject.active === true), go => this.updateGameObject(time, go.gameObject));
        this.transformUpdateTick.each(() => {
            this.collections('game').filterUpdate('game_object', go => go.gameObject.active === true, go => this.updateGameObject(time, go.gameObject));
        });
        this.debugTick.each(() => {
            if (this.debug) {
                console.log(`[server:${this.gameServer.ID}] scene actives: ${this.sceneActives.length} object: [${_.reduce(this.sceneActives, (acc, go) => { acc.push(go.name); return acc; }, [])}]`);
            }
        });
    }

    updateGameObject(time, gameObject) {
        const t = gameObject.transform;

        if (gameObject.instance instanceof Vehicule) {
            t.velocity = gameObject.instance.toSpeedMS();
            if (t) {
                t.position = t.position.add(t.rotation.x(t.velocity * Seconds(time.elapsed)));
            }
        }
    }
}

GameObjectService.$inject = ['Collections'];

export default GameObjectService;
