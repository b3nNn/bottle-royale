import Storm from './storm';
import ModuleProvider from './module-provider';
import { GameService } from '../../services/game-service';

const StormProxy = storm => {
    const _storm = storm;

    const proxy = {
        on: (event, callback) => {
            GameService.game.storm.events.on(event, callback, { clientID: _storm.client.ID });
        },
        off: (event, callback) => {
            GameService.game.storm.events.on(event, callback);
        }
    };

    return proxy;
}

class StormModuleProvider extends ModuleProvider {
    constructor(collections) {
        super();
        this.collections = collections;
    }

    createStorm(client) {
        const storm = new Storm(client);
        this.collections('game').push('storm', {
            serverID: GameService.serverID,
            clientID: client.ID,
            storm
        });
        return storm;
    }

    get(client) {
        const storm = StormProxy(this.createStorm(client));

        return storm;
    }

    getName() {
        return 'storm';
    }
}

export default StormModuleProvider;