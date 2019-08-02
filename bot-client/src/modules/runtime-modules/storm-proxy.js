import Storm from './storm';

const StormProxy = (client, factory) => {
    const _client = client;

    const handler = {
        construct(target, args) {
            return factory.createStorm(_client);
        },
        get(obj, prop) {
            return obj[prop]
        },
        set(obj, prop, value, receiver) {
            throw new Error('module \'storm-events\' is read only');
            return true;
        }
    };
    const proxy = new Proxy(Storm, handler);

    return proxy;
}

export default StormProxy;