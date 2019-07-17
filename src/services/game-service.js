// import GameService from '../modules/game/game-service';
import GameCollections from '../modules/game/game-collections';
// import ClientService from '../modules/game/client-service';
// import MatchmakingService from './matchmaking-service';
// import GameEngine from './game-engine-service';
import EventService from '../modules/game/event-service';
import RethinkDBPersistHandler from '../modules/io/rethinkdb-persist-handler';
import StormService from './storm-service';
// import VehiculeService from './vehicule-service';
// import BattleRoyaleNamespace from '../modules/runtime-modules/battle-royale-namespace';
// import MapService from './map-service';
// import GameObjectService from './game-object-service';

// const collections = GameCollections({
//     persistHandlers: [new RethinkDBPersistHandler({debug: false})]
// });
// const gameObjectService = new GameObjectService(collections);

// const gameService = new GameService(
//     collections,
//     new ClientService(collections, new EventService(collections, 'client_listener')),
//     new MatchmakingService(collections, new EventService(collections, 'matchmaking_listener')),
//     new GameEngine(collections,
//         new EventService(collections, 'game_listener'),
//         new StormService(collections, new EventService(collections, 'storm_listener')),
//         new VehiculeService(collections),
//         new MapService(collections),
//         gameObjectService),
//         new BattleRoyaleNamespace(collections)
//     );
// export { gameService as GameService, collections as GameCollections };