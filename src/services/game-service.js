import GameService from '../modules/game/game-service';
import GameCollections from '../modules/game/game-collections';
import GameClientService from '../modules/game/game-client-service';
import MatchmakingService from '../modules/game/matchmacking-service';
import GameEngine from '../modules/game/game-engine';
import EventService from '../modules/game/event-service';

const collections = GameCollections();
const gameService = new GameService(
    collections,
    new GameClientService(collections),
    new MatchmakingService(collections),
    new GameEngine(collections),
    new EventService(collections)
    );

export default gameService;