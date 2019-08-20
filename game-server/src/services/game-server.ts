
import _ from 'lodash';
import nanoid from 'nanoid';
import ApplicationConfig from '../modules/core/application-config';

class GameServer {
    static $inject: string[] = ['Collections', 'ClientService', 'Matchmaking', 'GameEngine'];

    private run: boolean;
    private ID: string;
    private collections: any;
    private clients: any;
    private matchmaking: any;
    private engine: any;

    constructor(collections: any, clientService: any, matchmaking: any, gameEngine: any) {
        this.ID = nanoid();
        this.collections = collections;
        this.clients = clientService;
        this.matchmaking = matchmaking;
        this.engine = gameEngine;
        this.run = true;
    }

    async init(config: ApplicationConfig): Promise<void> {
        await this.collections.init(_.assign({
            serverID: this.ID
        }, config));
        this.collections('game').push('server', {
            serverID: this.ID,
            host: config.host || undefined
        });
        this.engine.init(this);
    }

    async startMatchmaking(): Promise<any> {
        let instance = this.matchmaking.createInstance(this);
        this.matchmaking.open(instance);
        this.clients.handleMatchmaking(instance);
        this.matchmaking.start(instance);
        this.clients.bootstrapMatchmaking(instance);
        this.matchmaking.live(instance);
        this.engine.start(instance);
        return instance;
    }

    async endMatchmaking(): Promise<void> {
        this.matchmaking.end();
        this.engine.events.fire('matchmaking_end');
    }

    isRunning(): boolean {
        return this.run;
    }
}

export default GameServer;