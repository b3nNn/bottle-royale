import _ from 'lodash';
import GameClient from './game-client';
import GameCollections from './game-collections';
import GameBehavior from './game-behavior';
import { GameService } from '../../services/game-service';
import GamePlayer from './game-player';
import GameEventsProxy from './game-events-proxy';

class GameClientService {
    constructor(collection, eventService) {
        this.collections = collection;
        this.events = eventService;
        this.sandbox = {};
    }

    registerClientApp(client, app) {
        this.collections('runtime').push('app', {
            clientID: client.ID,
            app
        });
    }

    createClient() {
        const client = new GameClient();
        client.ID = this.collections('game.client').uid();
        this.collections('game').push('client', {
            clientID: client.ID,
            client
        });
        return client;
    }

    createBehavior(client) {
        const behavior = new GameBehavior(client);
        behavior.ID = this.collections('game.behavior').uid();
        this.collections('game').push('behavior', {
            clientID: client.ID,
            behaviorID: behavior.ID,
            behavior
        });
        return behavior;
    }

    createPlayer(client) {
        const player = new GamePlayer(client, this.createBehavior(client));
        player.ID = this.collections('game.player').uid();
        this.collections('game').push('player', {
            playerID: player.ID,
            clientID: client.ID,
            player
        });
        return player;
    }

    createGameProxy(client) {
        const gameProxy = new GameEventsProxy(client);
        return gameProxy;
    }

    connectClient(client, nickname) {
        
    }

    setupGameClients() {
    }

    bootstrapMatchmaking() {
        const readys = _.map(GameService.matchmaking.getReadyClients(), item => item.clientID);
        const matchmaking = {
            players: GameService.matchmaking.getPlayers()
        };
        const befors = this.events.filter('before_game_load', listener => readys.includes(listener.params.clientID));
        const afters = this.events.filter('after_game_load', listener => readys.includes(listener.params.clientID));

        _.each(befors, listener => {
            listener.callback(matchmaking);
        });
        GameService.matchmaking.events.each('load', listener => {
            listener.callback();
        });
        _.each(afters, listener => {
            listener.callback(matchmaking);
        });
    }
}

export default GameClientService;