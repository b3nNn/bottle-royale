class PlayerLocation {
    constructor(client) {
        this.client = client;
        this.region = 'efwfwefdsada';
    }

    serialize() {
        return {
            serverID: 0,
            clientID: this.ID,
        }
    }
}

export default PlayerLocation;
