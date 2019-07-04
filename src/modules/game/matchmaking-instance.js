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
        this.state = 'live';
    }

    close() {
        this.state = 'close';
    }
}

export default MatchmakingInstance;