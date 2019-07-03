import _ from 'lodash';
import nanoid from 'nanoid';
import GameCollections from './game-collections';

const Collections = GameCollections();

class GameClient {
    constructor() {
        this.longID = nanoid();
    }

    connect(nickname) {
        console.log(`[${this.longID}] ${nickname} is connected`);
    }

    on(event, callback) {
        console.log(`[${this.longID}] listener init ${this.ID}:${event}`);
        Collections('game').push('listener', {
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