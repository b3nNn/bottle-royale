import _ from 'lodash';
import { GameService } from '../../services/game-service';
import { GameObject } from './game-object';
import ClockTick from '../../components/clock-tick';
import { Seconds, toSeconds } from './time';
import Vehicule from './vehicule';
import Player from '../runtime-modules/player';
import { stringify } from 'flatted';

const authorisedKeys = ['ID', 'transform', 'instance', 'name', 'parent'];

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
        this.sceneActives.push(go);
        return go;
    }


    update(time) {
        _.each(this.sceneActives, gameObject => {
            this.updateGameObject(time, gameObject);
        });
        this.debugTick.each(() => {
            console.log(`scene actives: ${this.sceneActives.length}`);
            _.each(this.sceneActives, go => {
                console.log('-', go.name, go.transform.getPosition());
            });
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
