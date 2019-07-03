import _ from 'lodash';
import nanoid from 'nanoid';
import GameService from '../../services/game-service';

class GameClient {
    constructor() {
        this.longID = nanoid();
    }

    connect(nickname) {
        console.log(`[${this.longID}] ${nickname} is connected`);
    }

    on(event, callback) {
        console.log(`[${this.longID}] listener init ${this.ID}:${event}`);
        GameService.collections('game').push('listener', {
            clientID: this.ID,
            event,
            callback
        });
    }

    off(event) {

    }

    log(str) {
        console.log(`[${this.longID}] ${str}`);
    }
}

export default GameClient;