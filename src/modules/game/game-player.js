import { GameService } from '../../services/game-service';

class GamePlayer {
    constructor(client, behavior) {
        this.client = client;
        this.behavior = behavior;
    }

    serialize() {
        return {
            serverID: GameService.serverID,
            playerID: this.ID,
            clientID: this.client.ID,
            behaviorID: this.behavior.ID
        };
    }
}

export default GamePlayer;