// import Client from '../runtime-modules/client';
// import StormEvents from '../runtime-modules/storm';
// import GameEvents from '../runtime-modules/game-events';
import ModuleFactory from '../runtime-modules/module-factory';
import PlayerLocationFactory from '../runtime-modules/player-location-factory';
import StormModuleFactory from '../runtime-modules/storm-module-factory';
import ClientModuleFactory from '../runtime-modules/client-module-factory';
import GameEventsFactory from '../runtime-modules/game-events-factory';
import PlayerFactory from '../runtime-modules/player-factory';

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