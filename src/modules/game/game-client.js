import _ from 'lodash';
import nanoid from 'nanoid';
import GameService from '../../services/game-service';

class GameClient {
    constructor() {
        this.longID = nanoid();
    }

    connect(nickname) {
    }

    on(event, callback) {
        GameService.clients.events.on(event, callback, { clientID: this.ID });
    }

    off(event) {
        GameService.clients.events.off(event);
    }

    log(str) {
        console.log(`[${this.longID}] ${str}`);
    }
}

export default GameClient;