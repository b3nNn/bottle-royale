import { GameService } from '../../services/game-service';

const GameEvents = client => {
    const events = GameService.clients.createGameEvents(client);

    return events;
};

export default GameEvents;