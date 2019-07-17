import minimist from 'minimist';
import _ from 'lodash';
// import { GameService } from './services/game-service';
import Application from './modules/core/application';
import EventsFactory from './services/events-factory';
import GameServer from './services/game-server';
import MatchmackingService from './modules/game/matchmacking-service';
import mainLoop from './modules/game/main-loop';
import GameCollections from './modules/game/game-collections';
import StormService from './modules/game/storm-service';
import RethinkDBPersistHandler from './modules/io/rethinkdb-persist-handler';
import BundlesServices from './services/bundles-service';
import ClientService from './services/client-service';

import MatchmakingMiddleware from './middlewares/matchmaking';
import GameStormEngine from './middlewares/game-storm-engine';
import InlineBundleLoader from './middlewares/inline-bundle-loader';
import DevServer from './middlewares/dev-server';

const argv = minimist(process.argv.slice(2));
(async () => {
    const app = new Application(argv);
    app.service('Collections', GameCollections, {
        persistHandlers: [new RethinkDBPersistHandler({debug: false})]
    });
    app.service('EventsFactory', EventsFactory);
    app.service('ClientService', ClientService);
    app.service('GameServer', GameServer);
    app.service('Matchmaking', MatchmackingService);
    app.service('Storm', StormService);
    app.service('Bundles', BundlesServices);
    app.middleware(MatchmakingMiddleware);
    app.middleware(GameStormEngine);
    app.middleware(InlineBundleLoader);
    app.middleware(DevServer);
    await app.run(mainLoop);
})();

// let bundles = [];

// const run = async () => {
//     if (_.isArray(argv.bot)) {
//         bundles = argv.bot;
//     } else if (_.isString(argv.bot)) {
//         bundles.push(argv.bot);
//     }

//     try {
//         await GameService.init({
//             debug: argv.debug === true,
//             debugPersistence: argv['debug-persistence'] === true,
//             host: argv.host || 'localhost'
//         });
//     } catch(err) {
//         console.error('fatal error', err);
//         process.exit(-1);
//     }

//     GameService.game.events.on('matchmaking_start', () => {
//         console.log(`[server:${GameService.serverID}] matchmaking is now live with ${GameService.matchmaking.getReadyClients().length} player(s)`);
//     });
//     GameService.game.events.on('matchmaking_end', () => {
//         console.log(`[server:${GameService.serverID}] matchmaking is finished after ${GameService.game.tick.getElapsed() / 1000000}s`);
//     });
//     try {
//         await GameService.loadBundles(bundles);
//         await GameService.startMatchmaking();
//     } catch (err) {
//         console.error('fatal error', err);
//     }
// };

// run();