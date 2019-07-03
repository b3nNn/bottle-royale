import _ from 'lodash';
import GameService from '../../services/game-service';

class MatchmackingService {
    constructor(collections) {
        this.collections = collections;
    }

    open() {
        this.handleMatchmacking();
        const readys = _.map(this.collections('game').kind('client_ready'), item => item.clientID);
        const loads = this.collections('game').filter('client_app', app => readys.includes(app.clientID));
        const befors = GameService.events.filter('before_game_load', listener => readys.includes(listener.clientID));
        const afters = GameService.events.filter('after_game_load', listener => readys.includes(listener.clientID));

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

    handleMatchmacking() {
        const game = {
            accept: () => {
                console.log(`[${game.clientID}] matchmacking accepted`);
                this.joinClient(game.clientID);
            },
            reject: () => {}
        };
        GameService.events.each('game_found', listener => {
            game.clientID = listener.clientID;
            listener.callback(game);
        });
    }
}

export default MatchmackingService;