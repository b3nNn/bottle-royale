import _ from 'lodash';
import ClientModuleProvider from '../runtime-modules/client-module-provider';
import PlayerModuleProvider from '../runtime-modules/player-module-provider';
import PlayerLocationModuleProvider from '../runtime-modules/player-location-module-provider';
import GameEventsModuleProvider from '../runtime-modules/game-events-module-provider';
import StormModuleProvider from '../runtime-modules/storm-module-provider';

import PlayerLocation from '../runtime-modules/player-location';

class ClientModulesProvider {
    constructor(collections) {
        this.collections = collections;
        this.providers = [
            new ClientModuleProvider(collections),
            new PlayerModuleProvider(collections),
            new PlayerLocationModuleProvider(collections),
            new GameEventsModuleProvider(collections),
            new StormModuleProvider(collections)
        ];
    }

    get(client) {
        const modules = {};

        _.each(this.providers, provider => {
            modules[provider.getName()] = provider.get(client)
        });
        return modules;
    }
}

export default ClientModulesProvider;