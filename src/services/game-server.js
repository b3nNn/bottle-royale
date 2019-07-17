
import _ from 'lodash';
import nanoid from 'nanoid';
import BattleRoyaleNamespace from '../modules/runtime-modules/battle-royale-namespace';

class GameServer {
    constructor(collections, clientService) {
        this.ID = nanoid();
        this.collections = collections;
        this.clients = clientService;
        this.br = new BattleRoyaleNamespace(this);
        this.isRunning = true;
        this.bundles = [];
        this.loadedBundles = [];
    }

    addBundles(bundles) {
        this.bundles = _.concat(this.bundles, bundles);
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
                // console.log('init bundle', this.bundles);
                bundle.apps.bot.setup(client, namespace);
                await bundle.compile();
            } catch (err) {
                throw err;
            }
        }
    }
}

GameServer.$inject = ['Collections', 'ClientService'];

export default GameServer;