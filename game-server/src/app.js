import minimist from 'minimist';
import _ from 'lodash';
import Application from './modules/core/application';
import EventsFactory from './services/events-factory';
import GameServer from './services/game-server';
import MatchmakingService from './services/matchmaking-service';
import mainLoop from './modules/core/main-loop';
import GameCollections from './modules/io/game-collections';
import StormService from './services/storm-service';
import RethinkDBPersistHandler from './modules/io/rethinkdb-persist-handler';
import ClientService from './services/client-service';
import GameEngineService from './services/game-engine-service';
import GameObjectService from './services/game-object-service';
import MapService from './services/map-service';
import VehiculeService from './services/vehicule-service';

import MatchmakingMiddleware from './middlewares/matchmaking';
import GameStormEngine from './middlewares/game-storm-engine';
import DevServer from './middlewares/dev-server';

const argv = minimist(process.argv.slice(2));
(async () => {
    const app = new Application(argv);
    app.service('Collections', GameCollections, {
        persistHandlers: [new RethinkDBPersistHandler()],
        debug: false
    });
    app.service('EventsFactory', EventsFactory);
    app.service('GameObjects', GameObjectService);
    app.service('Map', MapService);
    app.service('Vehicules', VehiculeService);
    app.service('Matchmaking', MatchmakingService);
    app.service('ClientService', ClientService);
    app.service('Storm', StormService);
    app.service('GameEngine', GameEngineService);
    app.service('GameServer', GameServer);
    app.middleware(MatchmakingMiddleware);
    app.middleware(GameStormEngine);
    app.middleware(DevServer);
    await app.run(mainLoop);
})();
