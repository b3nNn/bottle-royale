import Storm from './storm';
import ModuleFactory from './module-factory';
import { GameService } from '../../services/game-service';
import StormProxy from './storm-proxy';

class StormModuleFactory extends ModuleFactory {
    constructor(gameServer) {
        super();
        this.gameServer = gameServer;
        this.collections = gameServer.collections;
    }

    createStorm(client) {
        const storm = new Storm(client);
        this.collections('game').push('storm_events', {
            serverID: this.gameServer.ID,
            clientID: client.ID,
            storm
        });
        return storm;
    }

    get(client) {
        const storm = StormProxy(client, this);

        return storm;
    }
}

export default StormModuleFactory;