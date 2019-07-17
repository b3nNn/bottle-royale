import _ from 'lodash';
// import { GameService } from '../../services/game-service';
import Matchmaking from '../modules/game/matchmaking';

class MatchmakingService {
    constructor(collections, eventsFactory) {
        this.collections = collections;
        this.events = eventsFactory.createProvider('matchmaking_service_listener');
        // this.gameServer = gameServer;
        this.instance = null;
    }

    open() {
        this.instance = this.createMatchmacking();
        this.instance.open();
        this.handleMatchmacking();
    }

    start() {
        this.instance.start();
        this.collections('game').filterOneUpdate('matchmaking', item => item.matchmakingID === this.instance.ID, matchmaking => {
            matchmaking.matchmaking.state = this.instance.state;
        });
    }

    live() {
        this.instance.live();
        this.collections('game').filterOneUpdate('matchmaking', item => item.matchmakingID === this.instance.ID, matchmaking => {
            matchmaking.matchmaking.state = this.instance.state;
        });
    }

    end() {
        this.instance.end();
        this.collections('game').filterOneUpdate('matchmaking', item => item.matchmakingID === this.instance.ID, matchmaking => {
            matchmaking.matchmaking.state = this.instance.state;
        });
    }

    joinMatchmakingClient(matchmaking, client) {
        this.collections('game').push('client_matchmaking_accept', {
            clientID: client.ID,
            matchmakingID: matchmaking.ID,
            serverID: this.gameServer.serverID
        });
    }

    getReadyClients() {
        return this.collections('game').filter('client_matchmaking_accept', item => item.matchmakingID === this.instance.ID);
    }

    getPlayers() {
        const readys = _.map(this.getReadyClients(), item => item.clientID);
        return this.collections('game').filter('player', player => readys.includes(player.clientID));
    }

    handleMatchmacking() {
        // GameService.clients.events.fire('game_found', this.instance.requestProxy);
    }

    createMatchmacking() {
        const matchmaking = new Matchmaking();
        matchmaking.ID = this.collections('game.matchmaking').uid();
        this.collections('game').push('matchmaking', {
            serverID: 0,
            matchmakingID: matchmaking.ID,
            matchmaking
        });
        return matchmaking;
    }
}

MatchmakingService.$inject = ['Collections', 'EventsFactory'];

export default MatchmakingService;