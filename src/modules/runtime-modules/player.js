import { GameService } from '../../services/game-service';

class Player {
    constructor(client, behavior) {
        this.client = client;
        this.behavior = behavior;
        this.vehicule = null;
    }

    action(name, params) {
        return GameService.game.execPlayerAction(this, name, params);
    }

    serialize() {
        return {
            serverID: GameService.serverID,
            playerID: this.ID,
            clientID: this.client.ID,
            behaviorID: this.behavior.ID,
            vehicule: this.vehicule
        };
    }
}

export default Player;