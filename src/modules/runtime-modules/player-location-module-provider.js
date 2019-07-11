import PlayerLocation from './player-location';
import ModuleProvider from './module-provider';
import { GameService } from '../../services/game-service';

const PlayerLocationProxy = gamePlayerLocation => {
    const location = gamePlayerLocation;

    const proxy = {
        get region() {
            return location.region;
        }
    };

    return proxy;
}

class PlayerLocationModuleProvider extends ModuleProvider {
    constructor(collections) {
        super();
        this.collections = collections;
    }

    createPlayerLocation(client) {
        const location = new PlayerLocation(client);
        location.ID = this.collections('game.player_location').uid();
        this.collections('game').push('player_location', {
            serverID: GameService.serverID,
            locationID: location.ID,
            clientID: client.ID,
            location
        });
        return location;
    }

    get(client) {
        const location = this.createPlayerLocation(client);
        const proxy = PlayerLocationProxy(location);

        return proxy;
    }

    getName() {
        return 'location';
    }
}

export default PlayerLocationModuleProvider;