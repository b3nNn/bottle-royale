import { GameService } from '../../services/game-service';

const GameEngine = client => {
    const engine = GameService.clients.createGameProxy(client);

    return engine;
};

export default GameEngine;