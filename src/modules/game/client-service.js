import _ from 'lodash';
import { GameService } from '../../services/game-service';

class ClientService {
    constructor(collection, eventService) {
        this.collections = collection;
        this.events = eventService;
        this.sandbox = {};
    }

    registerClientApp(client, app) {
        this.collections('runtime').push('app', {
            clientID: client.ID,
            app
        });
    }

    createClient() {
        const client = {
            ID: this.collections('runtime.client').uid()
        };
        this.collections('runtime').push('client', {
            clientID: client.ID,
        });
        return client;
    }

    bootstrapMatchmaking() {
        const readys = _.map(GameService.matchmaking.getReadyClients(), item => item.clientID);
        const befors = this.events.filter('before_game_load', listener => readys.includes(listener.params.clientID));
        const afters = this.events.filter('after_game_load', listener => readys.includes(listener.params.clientID));

        _.each(befors, listener => {
            listener.callback(matchmaking);
        });
        GameService.matchmaking.events.fire('load');
        _.each(afters, listener => {
            listener.callback(matchmaking);
        });
    }
}

export default ClientService;