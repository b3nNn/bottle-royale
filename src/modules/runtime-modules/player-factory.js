import _ from 'lodash';
import Player from './player';
import Behavior from './behavior';
import ModuleFactory from './module-provider';
import PlayerProxy from './player-proxy';

const BehaviorProxy = client => {
    const _client = client;
    const authorisedKeys = ['tags'];
    const handler = {
        construct(target, args) {
            return factory.createBehavior(_client);
        },
        get(obj, prop) {
            if (_.includes(authorisedKeys, prop)) {
                return obj[prop];
            }
        },
        set(obj, prop, value, receiver) {
            throw new Error('module \'behavior\' is read only');
            return true;
        },
        ownKeys: () => {
            return authorisedKeys;
        }
    };
    let proxy = new Proxy(Behavior, handler);
    return proxy;
}

class PlayerFactory extends ModuleFactory {
    constructor(gameServer) {
        super();
        this.gameServer = gameServer;
        this.collections = gameServer.collections;
    }

    createPlayer(client) {
        const player = new Player(client, this.createBehavior(client));
        player.ID = this.collections('game.player').uid();
        this.collections('game').push('player', {
            serverID: this.gameServer.ID,
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
            serverID: this.gameServer.ID,
            clientID: client.ID,
            behaviorID: behavior.ID,
            behavior
        });
        return behavior;
    }

    get(client) {
        const playerClientProxy = PlayerProxy(client, this);

        return playerClientProxy;
    }
}

export default PlayerFactory;