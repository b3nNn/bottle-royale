import Client from './client';
import ModuleFactory from './module-factory';
import ClientModuleProxy from './client-module-proxy';

class ClientModuleFactory extends ModuleFactory {
    constructor(gameServer) {
        super();
        this.gameServer = gameServer;
        this.collections = gameServer.collections;
        this.clientModules = [];
    }

    createClient(cli) {
        const client = new Client(this.gameServer.clients);
        client.ID = cli.ID;
        this.collections('game').push('client', {
            serverID: this.gameServer.ID,
            clientID: client.ID,
            client
        });
        return client;
    }

    getClientModuleProxy(client) {
        return this.clientModules[client.ID];
    }

    get(client) {
        let proxy = this.getClientModuleProxy(client);
        
        if (!proxy) {
            proxy = ClientModuleProxy(client, this);
            this.clientModules[client.ID] = proxy;
        }
        return proxy;
    }
}

export default ClientModuleFactory;