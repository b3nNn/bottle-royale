class Player {
    constructor(service, client, behavior) {
        this.service = service;
        this.client = client;
        this.behavior = behavior;
        this.vehicule = null;
    }

    action(name, params) {
        return this.service.execPlayerAction(this, name, params);
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