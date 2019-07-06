import _ from 'lodash';
import { GameService } from '../../services/game-service';
import MatchmakingInstance from './matchmaking-instance';

class MatchmackingService {
    constructor(collections, eventService) {
        this.collections = collections;
        this.events = eventService;
        this.current = null;
    }

    open() {
        this.current = this.createMatchmacking();
        this.current.open();
        this.handleMatchmacking();
    }

    start() {
        this.current.start();
        this.collections('game').filterOneUpdate('matchmaking', item => item.matchmakingID === this.current.ID, matchmaking => {
            matchmaking.matchmaking.state = this.current.state;
        });
    }

    live() {
        this.current.live();
        this.collections('game').filterOneUpdate('matchmaking', item => item.matchmakingID === this.current.ID, matchmaking => {
            matchmaking.matchmaking.state = this.current.state;
        });
    }

    end() {
        this.current.end();
        this.collections('game').filterOneUpdate('matchmaking', item => item.matchmakingID === this.current.ID, matchmaking => {
            matchmaking.matchmaking.state = this.current.state;
        });
    }

    joinClient(matchmakingID, clientID) {
        this.collections('game').push('client_matchmaking_accept', {
            clientID,
            matchmakingID,
            serverID: GameService.serverID
        });
    }

    getReadyClients() {
        return this.collections('game').filter('client_matchmaking_accept', item => item.matchmakingID === this.current.ID);
    }

    getPlayers() {
        return _.map(this.collections('game').kind('player', player => readys.includes(player.clientID)), item => {
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
                reject: () => {},
                on: (event, callback, params) => {
                    this.events.on(event, callback, params);
                },
                raise: (event, params) => {
                    this.events.raise(event, params);
                }
            });
            listener.callback(matchmaking);
        });
    }

    createMatchmacking() {
        const matchmaking = new MatchmakingInstance();
        matchmaking.ID = this.collections('game.matchmaking').uid();
        this.collections('game').push('matchmaking', {
            matchmakingID: matchmaking.ID,
            matchmaking
        });
        return matchmaking;
    }
}

export default MatchmackingService;