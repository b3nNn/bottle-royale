import Client from './client';
import ModuleFactory from './module-factory';
import { GameService } from '../../services/game-service';
import ClientProxy from './client-proxy';

class ClientModuleFactory extends ModuleFactory {
    constructor(collections) {
        super();
        this.collections = collections;
    }

    createClient(cli) {
        const client = new Client();
        client.ID = cli.ID;
        this.collections('game').push('client', {
            serverID: GameService.serverID,
            clientID: client.ID,
            client
        });
        return client;
    }

    get(cli) {
        const client = this.createClient(cli);
        const proxy = ClientProxy(client, this);
        return proxy;
    }
}

export default ClientModuleFactory;