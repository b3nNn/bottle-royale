import { GameService } from '../../services/game-service';

class GameEvents {
    constructor(client) {
        this.client = client;
    }

    on(event, callback) {
        GameService.game.events.on(event, callback, { clientID: this.client.ID });
    }

    off(event) {
        GameService.game.events.off(event);
    }

}

export default GameEvents;