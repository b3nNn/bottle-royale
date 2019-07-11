import { GameService } from '../../services/game-service';

const MatchmakingRequestProxy = matchmaking =>  {
    const proxy = {
        get state() {
            return matchmaking.state
        },
        get playersLimit() {
            return matchmaking.playersLimit
        },
        get map() {
            return matchmaking.map
        },
        accept: client => {
            GameService.matchmaking.joinMatchmakingClient(matchmaking, client);
        },
        reject: () => {},
        on: (event, callback, params) => {
            GameService.matchmaking.events.on(event, callback, params);
        },
        raise: (event, params) => {
            GameService.matchmaking.events.fire(event, params);
        }
    };
    return proxy;
};

class Matchmaking {
    constructor() {
        this.state = 'init';
        this.playersLimit = 100;
        this.map = null;
        this.requestProxy = MatchmakingRequestProxy(this);
    }

    open() {
        this.state = 'open';
    }

    start() {
        this.state = 'start';
    }

    live() {
        this.state = 'live';
    }

    end() {
        this.state = 'end';
    }

    serialize() {
        return {
            serverID: GameService.serverID,
            matchmakingID: this.ID,
            state: this.state,
            playersLimit: this.playersLimit,
            map: this.map
        }
    }
}

export default Matchmaking;