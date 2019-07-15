import { GameService } from '../../services/game-service';

class Storm {
    constructor(client) {
        this.client = client;
    }

    on(event, callback) {
        GameService.game.storm.events.on(event, callback, { clientID: this.client.ID });
    }
    off(event, callback) {
        GameService.game.storm.events.on(event, callback);
    }
}

function StormProxy() {
    const storm = new Storm();

    const proxy = new Proxy()
}

export default Storm;