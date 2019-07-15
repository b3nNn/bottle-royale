import _ from 'lodash';
import nanoid from 'nanoid';
import BotBundleLoader from '../bundle/bot-bundle-loader';
import sleep from '../../components/sleep';
import ClockTick from '../../components/clock-tick';
import { GameCollections } from '../../services/game-service';
import { toSeconds } from './time';

const framerate = toSeconds(1 / 10);

class GameService {
    constructor(collections, clientService, matchmakingService, gameEngine, battleRoyaleNamespace) {
        this.serverID;
        this.collections = collections;
        this.clients = clientService;
        this.matchmaking = matchmakingService;
        this.game = gameEngine;
        this.lastTick = null;
        this.debugTick = new ClockTick(5000000);
        this.matchmakingBehaviors = [];
        this.battleRoyaleNamespace = battleRoyaleNamespace;
    }

    async init(options) {
        const opts = options || {};

        this.serverID = nanoid();
        await GameCollections.init();
        this.collections('game').push('server', {
            serverID: this.serverID,
            host: opts.host || undefined
        });
        this.battleRoyaleNamespace.init();
    }

    async loadBundles(bundles) {
        const bots = [];

        for (let bundleFilename of bundles) {
            const botBundle = await BotBundleLoader.loadFromPath(bundleFilename);
            bots.push(botBundle);
        };
        for (let bundle of bots) {
            try {
                bundle.apps.bot.setup();
                await bundle.compile();
            } catch (err) {
                throw err;
            }
        }
    }

    async startMatchmaking() {
        this.matchmaking.open();
        this.matchmaking.start();
        this.clients.bootstrapMatchmaking();
        this.matchmaking.live();
        this.game.start();
        if (!this.lastTick) {
            this.lastTick = this.game.tick.getElapsed();
        }
        await this.mainLoop();
        this.matchmaking.end();
        this.game.events.fire('matchmaking_end');
    }

    async mainLoop() {
        let now;
        const time = {
            framerate,
            elapsed: 0,
            total: 0,
            prefs: {
                updateTime: 0,
                usage: 0
            }
        };
        this.matchmakingBehaviors = this.collections('game').kind('behavior');

        while (this.game.isRunning) {
            now = this.game.tick.getElapsed();
            time.elapsed = now - this.lastTick;
            time.total = now;
            time.prefs.usage = (time.prefs.updateTime / time.framerate) * 100;
            await this.update(time);
            time.prefs.updateTime = (this.game.tick.getElapsed() - now);
            // console.log('loop usage:', usage);
            if (time.prefs.updateTime < time.framerate) {
                await sleep((time.framerate - time.prefs.updateTime) / 1000);
            }
            this.lastTick = now;
        }
    }

    update(time) {
        this.game.update(time);
        this.updateBehaviors(time);
        this.debugTick.each(() => {
            console.log('loop time:', Math.round(time.prefs.updateTime), 'usage:', `${Math.round(time.prefs.usage)}%`, 'total:', Math.round(time.total / 1000000));
        });
    }

    updateBehaviors(time) {
        _.each(this.matchmakingBehaviors, client => {
            client.behavior.update(time);
        });
    }
}

export default GameService;