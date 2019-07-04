import _ from 'lodash';
import BotBundleLoader from '../bundle/bot-bundle-loader';
import sleep from '../../components/sleep';

const framerate = (1000 / 100);

class GameService {
    constructor(collections, clientService, matchmakingService, gameEngine, eventService) {
        this.collections = collections;
        this.clients = clientService;
        this.matchmaking = matchmakingService;
        this.game = gameEngine;
        this.events = eventService;
        this.sandbox = {};
        this.lastTick = null;
    }

    async loadBundles(bundles) {
        const bots = [];

        for (let bundleFilename of bundles) {
            const botBundle = await BotBundleLoader.loadFromPath(bundleFilename);
            bots.push(botBundle);
        };
        for (let bundle of bots) {
            try {
                await bundle.compile();
            } catch (err) {
                throw new Error(`bundles load error: ${err} at ${bundle.path}`);
            }
        }
    }

    async startMatchmaking() {
        this.clients.setupGameClients();
        this.matchmaking.open();
        this.matchmaking.start();
        this.clients.bootstrapMatchmaking();
        this.game.start();
        if (!this.lastTick) {
            this.lastTick = this.game.tick.getElapsed();
        }
        await this.mainLoop();
        this.matchmaking.close();
        this.game.events.each('matchmaking_ended', listener => {
            listener.callback();
        });
    }

    async mainLoop() {
        let now;
        let current;
        const clients = this.collections('runtime').kind('client_behavior');
        const time = {
            elapsed: 0,
            total: 0
        };

        while (this.game.isRunning) {
            now = this.game.tick.getElapsed();
            time.elapsed = now - this.lastTick;
            time.total = now;
            this.game.update(time);
            _.each(clients, cli => {
                cli.behavior.update(time);
            });
            current = (this.game.tick.getElapsed() - now) / 1000;
            if (current < framerate) {
                await sleep(framerate - current);
            }
            this.lastTick = now;
        }
    }
}

export default GameService;