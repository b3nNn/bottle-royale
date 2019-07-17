import ModuleFactory from './module-factory';
import PlayerLocationFactory from './player-location-factory';
import StormModuleFactory from './storm-module-factory';
import ClientModuleFactory from './client-module-factory';
import GameEventsFactory from './game-events-factory';
import PlayerFactory from './player-factory';

class BattleRoyaleNamespace extends ModuleFactory {
    constructor(collections) {
        super();
        this.collections = collections;
        this.playerLocationFactory = null;
        this.stormModuleFactory = null;
        this.clientModuleFactory = null;
        this.gameEventsFactory = null;
        this.playerFactory = null;
    }

    init() {
        this.playerLocationFactory = new PlayerLocationFactory(this.collections);
        this.stormModuleFactory = new StormModuleFactory(this.collections);
        this.clientModuleFactory = new ClientModuleFactory(this.collections);
        this.gameEventsFactory = new GameEventsFactory(this.collections);
        this.playerFactory = new PlayerFactory(this.collections);
    }

    get(client) {
        const namespace = {
            PlayerLocation: this.playerLocationFactory.get(client),
            Client: this.clientModuleFactory.get(client),
            StormEvents: this.stormModuleFactory.get(client),
            GameEvents: this.gameEventsFactory.get(client),
            Player: this.playerFactory.get(client)
        };
        return namespace;
    }
}

export default BattleRoyaleNamespace;