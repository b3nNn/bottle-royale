import _ from 'lodash';
import minimist from 'minimist';
import ApplicationConfig from '../modules/core/application-config';

class ClientService {
    static $inject: string[] = ['Collections', 'EventsFactory', 'Matchmaking'];
    private collections: any;
    private matchmaking: any;
    public events: any;
    public debug: boolean;
    public debugClients: boolean;

    constructor(collections: any, eventsFactory: any, matchmaking: any) {
        this.collections = collections;
        this.events = eventsFactory.createProvider('client_service_listener');
        this.matchmaking = matchmaking;
        this.debug = false;
        this.debugClients = false;
    }

    configure(config: ApplicationConfig, argv: minimist.ParsedArgs): void {
        this.debug = config.debug;
        this.debugClients = argv['debug-clients'] || false;
    }

    createClient(): any {
        const client = {
            ID: this.collections('runtime.client').uid()
        };
        this.collections('runtime').push('client', {
            clientID: client.ID,
        });
        return client;
    }

    connect(client: any): void {
        this.collections('game').filterOneUpdate('client', item => item.clientID === client.ID, cli => {
            if (cli) {
                cli.nickname = client.nickname;
            }
        });
    }

    handleMatchmaking(instance: any): void {
        this.events.fire('game_found', instance.requestProxy);
    }

    bootstrapMatchmaking(matchmaking: any): void {
        const readys = _.map(this.matchmaking.getReadyClients(matchmaking), item => item.clientID);

        this.events.fireFilter('before_game_load', listener => readys.includes(listener.params.clientID), matchmaking);
        matchmaking.service.events.fire('load');
        this.events.fireFilter('after_game_load', listener => readys.includes(listener.params.clientID), matchmaking);
    }
}

export default ClientService;