class GamePlayer {
    constructor(client, behavior) {
        this.client = client;
        this.behavior = behavior;
    }

    serialize() {
        return {
            playerID: this.ID,
            clientID: this.client.ID,
            behaviorID: this.behavior.ID
        };
    }
}

export default GamePlayer;