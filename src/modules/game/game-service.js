import _ from 'lodash';

class GameService {
    constructor(collections, clientService, matchmakingService, gameEngine, eventService) {
        this.collections = collections;
        this.clients = clientService;
        this.matchmacking = matchmakingService;
        this.game = gameEngine;
        this.events = eventService;
        this.sandbox = {};
    }

    startMatchmaking() {
        this.clients.setupGameClients();
        this.matchmacking.open();
        this.game.start();
    }

    mainLoop(run = true) {
        if (run) {
            _.each(this.collections('game').kind('client_behavior'), cli => {
                cli.behavior.update();
            });
            setTimeout(() => this.mainLoop(true), (1000 / 30));
        }
    }
}

export default GameService;