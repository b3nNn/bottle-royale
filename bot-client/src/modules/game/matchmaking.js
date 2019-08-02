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
            matchmaking.service.joinMatchmakingClient(matchmaking, client);
        },
        reject: () => {},
        on: (event, callback, params) => {
            matchmaking.service.events.on(event, callback, params);
        },
        raise: (event, params) => {
            matchmaking.service.events.fire(event, params);
        }
    };
    return proxy;
};

class Matchmaking {
    constructor(service, gameServer) {
        this.service = service;
        this.gameServer = gameServer;
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

    getPlayers() {
        return this.service.getPlayers(this);
    }

    serialize() {
        return {
            serverID: this.gameServer.ID,
            matchmakingID: this.ID,
            state: this.state,
            playersLimit: this.playersLimit,
            map: this.map
        }
    }
}

export default Matchmaking;