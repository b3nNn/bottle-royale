import PlayerLocation from './player-location';
import ModuleFactory from './module-factory';
import { GameService } from '../../services/game-service';
import PlayerLocationProxy from './player-location-proxy';

class PlayerLocationFactory extends ModuleFactory {
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
        return PlayerLocationProxy(client, this);
    }
}

export default PlayerLocationFactory;