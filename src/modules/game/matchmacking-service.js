import _ from 'lodash';
import GameService from '../../services/game-service';

class MatchmackingService {
    constructor(collections) {
        this.collections = collections;
    }

    open() {
        GameService.events.each('before_game_load', listener => {
            listener.callback();
        });
        _.each(this.collections('game').kind('client_app'), client => {
            client.app.load();
        });
        GameService.events.each('after_game_load', listener => {
            listener.callback();
        });
    }
}

export default MatchmackingService;