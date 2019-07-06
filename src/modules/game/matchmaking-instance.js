class MatchmakingInstance {
    constructor() {
        this.state = 'init';
        this.playersLimit = 100;
        this.map = null;
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
            matchmakingID: this.ID,
            state: this.state,
            playersLimit: this.playersLimit,
            map: this.map
        }
    }
}

export default MatchmakingInstance;