import Player from './player';
import Behavior from './behavior';
import ModuleProvider from './module-provider';

class PlayerModuleProvider extends ModuleProvider {
    constructor(collections) {
        super();
        this.collections = collections;
    }

    createPlayer(client) {
        const player = new Player(client, this.createBehavior(client));
        player.ID = this.collections('game.player').uid();
        this.collections('game').push('player', {
            playerID: player.ID,
            clientID: client.ID,
            player
        });
        return player;
    }

    createBehavior(client) {
        const behavior = new Behavior(client);
        behavior.ID = this.collections('game.behavior').uid();
        this.collections('game').push('behavior', {
            clientID: client.ID,
            behaviorID: behavior.ID,
            behavior
        });
        return behavior;
    }

    get(client) {
        const player = this.createPlayer(client);

        return {
            'player': player
        }
    }
}

export default PlayerModuleProvider;