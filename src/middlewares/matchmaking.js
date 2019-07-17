class MatchmakingMiddleware {
    constructor() {

    }

    run() {
        console.log('Matchmaking middleware runnning');
    }

    update(time) {
        console.log('Matchmaking middleware update', time.total);
    }
}

export default MatchmakingMiddleware;