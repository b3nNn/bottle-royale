import GameService from '../modules/game/game-service';
import GameCollections from '../modules/game/game-collections';
import GameClientService from '../modules/game/game-client-service';
import MatchmakingService from '../modules/game/matchmacking-service';
import GameEngine from '../modules/game/game-engine';
import EventService from '../modules/game/event-service';
import GameClientModules from '../modules/game/game-client-modules';

import RethinkDBPersistHandler from '../modules/io/rethinkdb-persist-handler';

const collections = GameCollections({
    persistHandlers: [new RethinkDBPersistHandler()]
});
const gameService = new GameService(
    collections,
    new GameClientService(collections, new EventService(collections, 'client_listener')),
    new MatchmakingService(collections, new EventService(collections, 'matchmaking_listener')),
    new GameEngine(collections, new EventService(collections, 'game_listener')),
    GameClientModules
    );
export { gameService as GameService, collections as GameCollections };