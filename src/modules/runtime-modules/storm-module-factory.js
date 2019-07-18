import Storm from './storm';
import ModuleFactory from './module-factory';
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
            serverID: 0,
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