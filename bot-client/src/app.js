import minimist from 'minimist';
import _ from 'lodash';
import Application from './modules/core/application';
import EventsFactory from './services/events-factory';
import mainLoop from './modules/core/main-loop';
import GameCollections from './modules/io/game-collections';
import BundlesServices from './services/bundles-service';
import ClientService from './services/client-service';

import InlineBundleLoader from './middlewares/inline-bundle-loader';
import DevServer from './middlewares/dev-server';
import GameServer from './services/game-server';

const argv = minimist(process.argv.slice(2));
(async () => {
    const app = new Application(argv);
    app.service('Collections', GameCollections);
    app.service('EventsFactory', EventsFactory);
    app.service('Bundles', BundlesServices);
    app.service('ClientService', ClientService);
    app.service('GameServer', GameServer);
    app.middleware(InlineBundleLoader);
    app.middleware(DevServer);
    await app.run(mainLoop);
})();
