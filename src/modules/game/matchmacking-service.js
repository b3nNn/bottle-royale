import _ from 'lodash';
import GameService from '../../services/game-service';
import MatchmakingInstance from './matchmaking-instance';

class MatchmackingService {
    constructor(collections, eventService) {
        this.collections = collections;
        this.events = eventService;
        this.current = this.createMatchmacking();
    }

    open() {
        this.current.open();
        this.handleMatchmacking();
    }

    start() {
        this.current.start();
        const matchmaking = this.collections('game').filterOne('matchmaking', item => item.matchmakingID === this.current.ID);
        if (matchmaking) {
            matchmaking.state = this.current.state;
        }
    }

    close() {
        this.current.close();
        const matchmaking = this.collections('game').filterOne('matchmaking', item => item.matchmakingID === this.current.ID);
        if (matchmaking) {
            matchmaking.state = this.current.state;
        }
    }

    joinClient(matchmakingID, clientID) {
        this.collections('game').push('client_ready', {
            clientID,
            matchmakingID
        });
    }

    getReadyClients() {
        return this.collections('game').filter('client_ready', item => item.matchmakingID === this.current.ID);
    }

    getPlayers() {
        return _.map(this.collections('runtime').kind('client_player', player => readys.includes(player.clientID)), item => {
            return {
                ID: item.player.ID,
                nickname: item.player.client.nickname
            };
        });
    }

    handleMatchmacking() {
        let matchmaking;

        GameService.clients.events.each('game_found', listener => {
            matchmaking = _.merge(this.current, {
                accept: client => {
                    this.joinClient(this.current.ID, client.ID);
                },
                reject: () => {}
            });
            listener.callback(matchmaking);
        });
    }

    createMatchmacking() {
        const matchmaking = new MatchmakingInstance();
        matchmaking.ID = this.collections('game.client_identity').uid();
        this.collections('game').push('matchmaking', {
            matchmakingID: matchmaking.ID,
            state: matchmaking.state
        });
        return matchmaking;
    }
}

export default MatchmackingService;