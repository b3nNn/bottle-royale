
import _ from 'lodash';
import nanoid from 'nanoid';
import BattleRoyaleNamespace from '../modules/runtime-modules/battle-royale-namespace';

class GameServer {
    constructor(collections, clientService, matchmaking, gameEngine) {
        this.ID = nanoid();
        this.collections = collections;
        this.clients = clientService;
        this.matchmaking = matchmaking;
        this.game = gameEngine;
        this.br = new BattleRoyaleNamespace(this);
        this.isRunning = true;
        this.bundles = [];
        this.loadedBundles = [];
    }

    async addBundles(bundles) {
        this.bundles = _.concat(this.bundles, bundles);
        return this.bundles;
    }

    async init() {
        let client;
        let namespace;

        this.br.init();
        for (let bundle of this.bundles) {
            try {
                bundle.load();
                client = this.clients.createClient();
                namespace = this.br.get(client);
                bundle.apps.bot.setup(client, namespace);
                await bundle.compile();
            } catch (err) {
                throw err;
            }
        }
    }

    async startMatchmaking() {
        this.matchmaking.open();
        this.matchmaking.start();
        this.clients.bootstrapMatchmaking();
        this.matchmaking.live();
        this.game.start();
        // if (!this.lastTick) {
        //     this.lastTick = this.game.tick.getElapsed();
        // }
        // await this.mainLoop();
        // this.matchmaking.end();
        // this.game.events.fire('matchmaking_end');
    }
}

GameServer.$inject = ['Collections', 'ClientService', 'Matchmaking', 'GameEngine'];

export default GameServer;