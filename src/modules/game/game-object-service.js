import _ from 'lodash';
import { GameService } from '../../services/game-service';
import { GameObject } from './game-object';
import ClockTick from '../../components/clock-tick';
import { Seconds, toSeconds, toMilliseconds } from './time';
import Vehicule from './vehicule';
import Player from '../runtime-modules/player';
import { stringify } from 'flatted';

class GameObjectService {
    constructor(collections) {
        this.sceneActives = [];
        this.collections = collections;
        this.debugTick = new ClockTick(toSeconds(5));
        this.transformUpdateTick = new ClockTick(toMilliseconds(1000 / 3));
    }

    createGameObject(baseInstance) {
        const go = new GameObject(baseInstance);
        go.ID = this.collections('game').uid('game.game_object');
        this.collections('game').push('game_object', {
            serverID: GameService.serverID,
            gameObjectID: go.ID,
            gameObject: go
        });
        this.sceneActives.push(go);
        return go;
    }

    start() {}

    update(time) {
        this.transformUpdateTick.each(() => {
            this.collections('game').filterUpdate('game_object', go => go.gameObject.active === true, go => this.updateGameObject(time, go.gameObject));
        });
        this.debugTick.each(() => {
            console.log(`scene actives: ${this.sceneActives.length}`);
            // _.each(this.sceneActives, go => {
            //     console.log('-', go.name, go.transform.getPosition());
            // });
        });
    }

    updateGameObject(time, gameObject) {
        const t = gameObject.transform;

        if (gameObject.instance instanceof Vehicule) {
            t.velocity = gameObject.instance.toSpeedMS();
        }
        if (t) {
            t.position = t.position.add(t.rotation.x(t.velocity * Seconds(time.elapsed)));
        }
    }
}

export default GameObjectService;
