import _ from 'lodash';
import { GameService } from '../../services/game-service';
import { GameObject } from './game-object';
import ClockTick from '../../components/clock-tick';
import { Seconds, toSeconds } from './time';

const authorisedKeys = ['ID', 'transform'];

const GameObjectProxy = go => {
    const _go = go;
    const handler = {
        get(obj, prop) {
            if (_.includes(authorisedKeys, prop)) {
                return obj[prop];
            }
        },
        set(obj, prop, value, receiver) {
            throw new Error('module \'GameObject\' is read only');
            return true;
        },
        ownKeys: () => {
            return authorisedKeys;
        }
    };
    const proxy = new Proxy(_go, handler);

    return proxy;
}

class GameObjectService {
    constructor(collections) {
        this.sceneActives = [];
        this.collections = collections;
        this.debugTick = new ClockTick(toSeconds(5));
    }

    createGameObject(baseInstance) {
        const go = new GameObject(baseInstance);
        go.ID = this.collections('game').uid('game.game_object');
        this.collections('game').push('game_object', {
            serverID: GameService.serverID,
            gameObject: go
        });
        const proxy = GameObjectProxy(go);
        this.sceneActives.push(proxy);
        return proxy;
    }


    update(time) {
        _.each(this.sceneActives, gameObject => {
            this.updateGameObject(time, gameObject);
        });
        this.debugTick.each(() => {
            console.log(`scene actives: ${this.sceneActives.length}`);
        });
    }

    updateGameObject(time, gameObject) {
        const t = gameObject.transform;

        if (t) {
            t.position = t.position.add(t.rotation.x(Seconds(time.elapsed)));
        }
    }
}

export default GameObjectService;
