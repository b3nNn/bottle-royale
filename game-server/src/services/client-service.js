import _ from 'lodash';

class ClientService {
    constructor(collection, eventsFactory, matchmaking) {
        this.collections = collection;
        this.events = eventsFactory.createProvider('client_service_listener');
        this.matchmaking = matchmaking;
        this.sandbox = {};
    }

    configure(config, argv) {
        this.debug = config.debug;
        this.debugClients = argv['debug-clients'] || false;
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

    connect(client) {
        this.collections('game').filterOneUpdate('client', item => item.clientID === client.ID, cli => {
            if (cli) {
                cli.nickname = client.nickname;
            }
        });
    }

    handleMatchmaking(instance) {
        this.events.fire('game_found', instance.requestProxy);
    }

    bootstrapMatchmaking(matchmaking) {
        const readys = _.map(this.matchmaking.getReadyClients(matchmaking), item => item.clientID);

        this.events.fireFilter('before_game_load', listener => readys.includes(listener.params.clientID), matchmaking);
        matchmaking.service.events.fire('load');
        this.events.fireFilter('after_game_load', listener => readys.includes(listener.params.clientID), matchmaking);
    }
}

ClientService.$inject = ['Collections', 'EventsFactory', 'Matchmaking'];

export default ClientService;