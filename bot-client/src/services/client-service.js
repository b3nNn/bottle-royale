import _ from 'lodash';

class ClientService {
    constructor(collection, eventsFactory) {
        this.collections = collection;
        this.events = eventsFactory.createProvider('client_service_listener');
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
}

ClientService.$inject = ['Collections', 'EventsFactory'];

export default ClientService;