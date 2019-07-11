import _ from 'lodash';
import Player from './player';
import Behavior from './behavior';
import ModuleProvider from './module-provider';
import { GameService } from '../../services/game-service';

const BehaviorProxy = behavior => {
    const _behavior = behavior;

    const proxy = {
        createStrategy: name => {
            return _behavior.createStrategy(name);
        },
        while: (tags, strategy, callback) => {
            return _behavior.while(tags, strategy, callback);
        }
    };

    return proxy;
}

function PlayerClientProxy(player) {
    const authorisedKeys = ['ID', 'behavior', 'vehicule', 'test_ID'];
    const handler = {
        get(obj, prop) {
            console.log('proxy get', prop);
            if (_.includes(authorisedKeys, prop)) {
                return obj[prop];
            }
        },
        set(obj, prop, value, receiver) {
            console.log('proxy set', prop, value);
            // throw new Error('module \'player\' is read only');
            return true;
        },
        // defineProperty: (target, key, descriptor) => {
        //     console.log('proxy defineProperty', key, descriptor);
        //     // throw new Error('player module is read-only.')
        //     return true;
        // },
        ownKeys: () => {
            console.log('proxy ownKeys');
            return authorisedKeys;
        }
    };
    let proxy = new Proxy(player, handler);
    // console.log('PROXY IS ', proxy.handler);
    return proxy;
}

class PlayerModuleProvider extends ModuleProvider {
    constructor(collections) {
        super();
        this.collections = collections;
    }

    createPlayer(client) {
        const player = new Player(client, this.createBehavior(client));
        player.ID = this.collections('game.player').uid();
        this.collections('game').push('player', {
            serverID: GameService.serverID,
            playerID: player.ID,
            clientID: client.ID,
            player
        });
        return player;
    }

    createBehavior(client) {
        const behavior = new Behavior(client);
        const proxy = BehaviorProxy(behavior);
        behavior.ID = this.collections('game.behavior').uid();
        this.collections('game').push('behavior', {
            serverID: GameService.serverID,
            clientID: client.ID,
            behaviorID: behavior.ID,
            behavior
        });
        return proxy;
    }

    get(client) {
        const player = this.createPlayer(client);
        const playerClientProxy = PlayerClientProxy(player);

        return playerClientProxy;
    }

    getName() {
        return 'player';
    }
}

export default PlayerModuleProvider;