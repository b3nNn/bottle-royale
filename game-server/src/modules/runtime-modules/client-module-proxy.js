import _ from 'lodash';
import Client from './client';
import ClientProxy from './client-proxy';

const ClientModuleProxy = (client, factory) => {
    const _client = client;
    const _cli = factory.createClient(_client);
    const handler = {
        construct(target, args) {
            return _clientProxy;
        }
    };
    const proxy = new Proxy(Client, handler);
    const _clientProxy = ClientProxy(_cli, Client.prototype);
    return proxy;
}

export default ClientModuleProxy;