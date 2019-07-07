import _ from 'lodash';
import ClientModuleProvider from '../runtime-modules/client-module-provider';
import PlayerModuleProvider from '../runtime-modules/player-module-provider';
import PlayerLocationModuleProvider from '../runtime-modules/player-location-module-provider';
import GameEventsModuleProvider from '../runtime-modules/game-events-module-provider';

class ClientModulesProvider {
    constructor(collections) {
        this.collections = collections;
        this.providers = [
            new ClientModuleProvider(collections),
            new PlayerModuleProvider(collections),
            new PlayerLocationModuleProvider(collections),
            new GameEventsModuleProvider(collections)
        ];
    }

    get(client) {
        const modules = {};

        _.each(this.providers, provider => {
            const module = provider.get(client);
            if (module) {
                _.merge(modules, module);
            }
        });
        return modules;
    }
}

export default ClientModulesProvider;