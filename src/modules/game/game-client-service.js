import _ from 'lodash';
import GameClient from './game-client';
import GameCollections from './game-collections';
import GameBehavior from './game-behavior';
import GameService from '../../services/game-service';

class GameClientService {
    constructor(collection) {
        this.collections = collection;
        this.sandbox = {};
    }

    createClient(app) {
        const client = new GameClient();
        client.ID = this.collections('lobby').uid();
        this.collections('lobby').push('client_identity', {
            clientID: client.ID,
            longID: client.longID
        });
        this.collections('game').push('client_app', {
            clientID: client.ID,
            app
        });
        return client;
    }

    createBehavior(client) {
        const behavior = new GameBehavior(client);
        this.collections('game').push('client_behavior', {
            clientID: client.ID,
            behavior
        });
        return behavior;
    }

    setupGameClients() {
        _.each(this.collections('game').kind('client_app'), client => {
            client.app.prepare();
        });
    }
}

export default GameClientService;