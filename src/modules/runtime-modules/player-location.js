import { GameService } from '../../services/game-service';

class PlayerLocation {
    constructor(client) {
        this.client = client;
        this.region = 'efwfwefdsada';
    }

    serialize() {
        return {
            serverID: GameService.serverID,
            clientID: this.ID,
        }
    }
}

export default PlayerLocation;
