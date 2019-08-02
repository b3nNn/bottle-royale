
import _ from 'lodash';
import nanoid from 'nanoid';
import BattleRoyaleNamespace from '../modules/runtime-modules/battle-royale-namespace';

class GameServer {
    constructor(collections, clientService) {
        this.debug = true;
        this.ID = nanoid();
        this.collections = collections;
        this.clients = clientService;
        this.br = new BattleRoyaleNamespace(this);
        this.isRunning = true;
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
        this.br.init();
        for (let bundle of this.bundles) {
            try {
                bundle.load();
                client = this.clients.createClient();
                namespace = this.br.get(client);
                bundle.setup(client, namespace);
                await bundle.compile();
            } catch (err) {
                throw err;
            }
        }
    }

    async connect() {

    }
}

GameServer.$inject = ['Collections', 'ClientService'];

export default GameServer;