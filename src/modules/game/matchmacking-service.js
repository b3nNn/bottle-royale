import _ from 'lodash';
import GameService from '../../services/game-service';

class MatchmackingService {
    constructor(collections, eventService) {
        this.collections = collections;
        this.events = eventService;
    }

    open() {
        this.handleMatchmacking();
        const readys = _.map(this.getReadyClients(), item => item.clientID);
        const loads = this.collections('runtime').filter('client_app', app => readys.includes(app.clientID));
        const befors = GameService.clients.events.filter('before_game_load', listener => readys.includes(listener.params.clientID));
        const afters = GameService.clients.events.filter('after_game_load', listener => readys.includes(listener.params.clientID));

        _.each(befors, listener => {
            listener.callback();
        });
        _.each(loads, client => {
            client.app.load();
        });
        _.each(afters, listener => {
            listener.callback();
        });
    }

    joinClient(clientID) {
        this.collections('game').push('client_ready', {
            clientID: clientID
        });
    }

    getReadyClients() {
        return this.collections('game').kind('client_ready');
    }

    handleMatchmacking() {
        const matchmaking = {
            accept: () => {
                this.joinClient(matchmaking.clientID);
            },
            reject: () => {}
        };
        GameService.clients.events.each('game_found', listener => {
            matchmaking.clientID = listener.params.clientID;
            listener.callback(matchmaking);
        });
    }
}

export default MatchmackingService;