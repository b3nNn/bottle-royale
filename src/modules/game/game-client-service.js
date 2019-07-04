import _ from 'lodash';
import GameClient from './game-client';
import GameCollections from './game-collections';
import GameBehavior from './game-behavior';
import GameService from '../../services/game-service';

class GameClientService {
    constructor(collection, eventService) {
        this.collections = collection;
        this.events = eventService;
        this.sandbox = {};
    }

    createClient(app) {
        const client = new GameClient();
        client.ID = this.collections('game.client_identity').uid();
        this.collections('game').push('client_identity', {
            clientID: client.ID,
            longID: client.longID
        });
        this.collections('runtime').push('client_app', {
            clientID: client.ID,
            app
        });
        return client;
    }

    createBehavior(client) {
        const behavior = new GameBehavior(client);
        this.collections('runtime').push('client_behavior', {
            clientID: client.ID,
            behavior
        });
        return behavior;
    }

    setupGameClients() {
        _.each(this.collections('runtime').kind('client_app'), client => {
            client.app.ready();
        });
    }
}

export default GameClientService;