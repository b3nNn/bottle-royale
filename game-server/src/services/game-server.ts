
import _ from 'lodash';
import nanoid from 'nanoid';

class GameServer {
    private run: boolean;

    constructor(collections, clientService, matchmaking, gameEngine) {
        this.debug = true;
        this.ID = nanoid();
        this.collections = collections;
        this.clients = clientService;
        this.matchmaking = matchmaking;
        this.engine = gameEngine;
        this.run = true;
        this.bundles = [];
        this.loadedBundles = [];
    }

    async addBundles(bundles) {
        this.bundles = _.concat(this.bundles, bundles);
        return this.bundles;
    }

    async init(config) {
        let client;
        let namespace;

        await this.collections.init(_.assign({
            serverID: this.ID
        }, config));
        this.collections('game').push('server', {
            serverID: this.ID,
            host: config.host || undefined
        });
        this.engine.init(this);
    }

    async startMatchmaking() {
        let instance = this.matchmaking.createInstance(this);
        this.matchmaking.open(instance);
        this.clients.handleMatchmaking(instance);
        this.matchmaking.start(instance);
        this.clients.bootstrapMatchmaking(instance);
        this.matchmaking.live(instance);
        this.engine.start(instance);
    }

    async endMatchmaking() {
        this.matchmaking.end();
        this.engine.events.fire('matchmaking_end');
    }

    isRunning(): boolean {
        return this.run;
    }
}

GameServer.$inject = ['Collections', 'ClientService', 'Matchmaking', 'GameEngine'];

export default GameServer;