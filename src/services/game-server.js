
import nanoid from 'nanoid';

class GameServer {
    constructor(collections) {
        this.ID = nanoid();
        this.collections = collections;
        this.isRunning = true;
    }
}

GameServer.$inject = ['Collections'];

export default GameServer;