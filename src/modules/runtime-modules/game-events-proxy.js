import GameEvents from './game-events';

const GameEventsProxy = (client, factory) => {
    const _client = client;

    const handler = {
        construct(target, args) {
            return factory.createGameEvents(_client);
        },
        get(obj, prop) {
            return obj[prop]
        },
        set(obj, prop, value, receiver) {
            throw new Error('module \'game-events\' is read only');
            return true;
        }
    };
    const proxy = new Proxy(GameEvents, handler);

    return proxy;
}

export default GameEventsProxy;