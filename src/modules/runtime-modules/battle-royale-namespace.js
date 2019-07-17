import ModuleFactory from './module-factory';
import PlayerLocationFactory from './player-location-factory';
import StormModuleFactory from './storm-module-factory';
import ClientModuleFactory from './client-module-factory';
import GameEventsFactory from './game-events-factory';
import PlayerFactory from './player-factory';

class BattleRoyaleNamespace extends ModuleFactory {
    constructor(gameServer) {
        super();
        this.gameServer = gameServer;
        this.playerLocationFactory = null;
        this.stormModuleFactory = null;
        this.clientModuleFactory = null;
        this.gameEventsFactory = null;
        this.playerFactory = null;
    }

    init() {
        this.playerLocationFactory = new PlayerLocationFactory(this.gameServer);
        this.stormModuleFactory = new StormModuleFactory(this.gameServer);
        this.clientModuleFactory = new ClientModuleFactory(this.gameServer);
        this.gameEventsFactory = new GameEventsFactory(this.gameServer);
        this.playerFactory = new PlayerFactory(this.gameServer);
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