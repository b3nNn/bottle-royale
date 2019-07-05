import GameService from '../../services/game-service';

const GamePlayer = client => {
    const player = GameService.clients.createPlayer(client);

    return player;
};

export default GamePlayer;