import PlayerLocation from './player-location';
import ModuleFactory from './module-factory';
import PlayerLocationProxy from './player-location-proxy';

class PlayerLocationFactory extends ModuleFactory {
    constructor(gameServer) {
        super();
        this.gameServer = gameServer;
        this.collections = gameServer.collections;
    }

    createPlayerLocation(client) {
        const location = new PlayerLocation(client);
        location.ID = this.collections('game.player_location').uid();
        this.collections('game').push('player_location', {
            serverID: this.gameServer.ID,
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