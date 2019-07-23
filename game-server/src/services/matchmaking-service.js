import _ from 'lodash';
import Matchmaking from '../modules/game/matchmaking';

class MatchmakingService {
    constructor(collections, eventsFactory) {
        this.collections = collections;
        this.events = eventsFactory.createProvider('matchmaking_service_listener');
    }

    createInstance(gameServer) {
        return this.createMatchmacking(gameServer);
    }

    open(instance) {
        instance.open();
        this.collections('game').filterOneUpdate('matchmaking', item => item.matchmakingID === instance.ID, matchmaking => {
            matchmaking.matchmaking.state = instance.state;
        });
    }

    start(instance) {
        instance.start();
        this.collections('game').filterOneUpdate('matchmaking', item => item.matchmakingID === instance.ID, matchmaking => {
            matchmaking.matchmaking.state = instance.state;
        });
    }

    live(instance) {
        instance.live();
        this.collections('game').filterOneUpdate('matchmaking', item => item.matchmakingID === instance.ID, matchmaking => {
            matchmaking.matchmaking.state = instance.state;
        });
    }

    end(instance) {
        instance.end();
        this.collections('game').filterOneUpdate('matchmaking', item => item.matchmakingID === instance.ID, matchmaking => {
            matchmaking.matchmaking.state = instance.state;
        });
    }

    joinMatchmakingClient(matchmaking, client) {
        this.collections('game').push('client_matchmaking_accept', {
            clientID: client.ID,
            matchmakingID: matchmaking.ID,
            serverID: matchmaking.gameServer.ID
        });
    }

    getReadyClients(instance) {
        return this.collections('game').filter('client_matchmaking_accept', item => item.matchmakingID === instance.ID);
    }

    getPlayers(instance) {
        const readys = _.map(this.getReadyClients(instance), item => item.clientID);
        return this.collections('game').filter('player', player => readys.includes(player.clientID));
    }

    createMatchmacking(gameServer) {
        const matchmaking = new Matchmaking(this, gameServer);
        matchmaking.ID = this.collections('game.matchmaking').uid();
        this.collections('game').push('matchmaking', {
            serverID: gameServer.ID,
            matchmakingID: matchmaking.ID,
            matchmaking
        });
        return matchmaking;
    }
}

MatchmakingService.$inject = ['Collections', 'EventsFactory'];

export default MatchmakingService;