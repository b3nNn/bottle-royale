import _ from 'lodash';
import Player from './player';

const PlayerProxy = (client, factory) => {
    const _client = client;
    const authorisedKeys = ['ID', 'behavior', 'vehicule', 'test_ID'];
    const handler = {
        construct(target, args) {
            return factory.createPlayer(_client);
        },
        get(obj, prop) {
            if (_.includes(authorisedKeys, prop)) {
                return obj[prop];
            }
        },
        set(obj, prop, value, receiver) {
            throw new Error('module \'player\' is read only');
            return true;
        },
        ownKeys: () => {
            return authorisedKeys;
        }
    };
    let proxy = new Proxy(Player, handler);
    return proxy;
}

export default PlayerProxy;