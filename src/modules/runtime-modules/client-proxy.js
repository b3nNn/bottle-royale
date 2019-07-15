import Client from './client';

const ClientProxy = (client) => {
    const _client = client;

    const handler = {
        construct(target, args) {
            return _client;
        },
        get(obj, prop) {
            return obj[prop]
        },
        set(obj, prop, value, receiver) {
            throw new Error('module \'client\' is read only');
            return true;
        }
    };
    const proxy = new Proxy(Client, handler);

    return proxy;
}

export default ClientProxy;