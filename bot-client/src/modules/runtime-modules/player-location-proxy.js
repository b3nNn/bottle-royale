import PlayerLocation from './player-location';

const PlayerLocationProxy = (client, factory) => {
    const _client = client;

    const handler = {
        construct(target, args) {
            return factory.createPlayerLocation(_client);
        },
        get(obj, prop) {
            return obj[prop]
        },
        set(obj, prop, value, receiver) {
            throw new Error('module \'location\' is read only');
            return true;
        }
    };
    const proxy = new Proxy(PlayerLocation, handler);

    return proxy;
}

export default PlayerLocationProxy;