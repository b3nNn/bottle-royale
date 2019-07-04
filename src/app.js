import minimist from 'minimist';
import _ from 'lodash';
import GameService from './services/game-service';

const argv = minimist(process.argv.slice(2));
let bundles = [];

const run = async () => {
    if (_.isArray(argv.bot)) {
        bundles = argv.bot;
    } else if (_.isString(argv.bot)) {
        bundles.push(argv.bot);
    }

    GameService.game.events.on('matchmaking_start', () => {
        console.log(`matchmaking is now live with ${GameService.matchmaking.getReadyClients().length} player(s)`);
    });
    GameService.game.events.on('matchmaking_ended', () => {
        console.log(`matchmaking is finished after ${GameService.game.tick.getElapsed() / 1000000}s`);
    });
    try {
        await GameService.loadBundles(bundles);
        await GameService.startMatchmaking();
    } catch (err) {
        console.error('fatal error', err);
    }
    // console.log('collections', GameService.collections('game').all());
};

run();