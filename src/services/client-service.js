import _ from 'lodash';

class ClientService {
    constructor(collection, eventsFactory, matchmaking) {
        this.collections = collection;
        this.events = eventsFactory.createProvider('client_service_listener');
        this.matchmaking = matchmaking;
        this.sandbox = {};
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
        const readys = _.map(this.matchmaking.getReadyClients(), item => item.clientID);
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

ClientService.$inject = ['Collections', 'EventsFactory'];

export default ClientService;