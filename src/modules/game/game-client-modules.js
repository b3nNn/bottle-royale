import GameClient from '../js-api/game-client';
import GamePlayer from '../js-api/game-player';
import GameEngine from '../js-api/game-engine';

const GameClientModules = (client) => {
    return {
        location: {
            location: `${client.ID}: somewhere`
        },
        'game-client': GameClient(client),
        'game-player': GamePlayer(client),
        'game-engine': GameEngine(client)
    }
};

export default GameClientModules;