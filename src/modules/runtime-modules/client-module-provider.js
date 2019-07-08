import Client from './client';
import ModuleProvider from './module-provider';
import { GameService } from '../../services/game-service';

class ClientModuleProvider extends ModuleProvider {
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

        return {
            'client': client
        }
    }
}

export default ClientModuleProvider;