import minimist from 'minimist';
import _ from 'lodash';
import BotBundleLoader from './modules/bundle/bot-bundle-loader';
import GameService from './services/game-service';

const argv = minimist(process.argv.slice(2));
let bundles = [];
const bots = [];

const run = async () => {
    if (_.isArray(argv.bot)) {
        bundles = argv.bot;
    } else if (_.isString(argv.bot)) {
        bundles.push(argv.bot);
    }

    for (let bundleFilename of bundles) {
        const botBundle = await BotBundleLoader.loadFromPath(bundleFilename);
        bots.push(botBundle);
    };
    for (let bundle of bots) {
        try {
            await bundle.compile();
            console.log('bundle loaded', bundle.path);
        } catch (err) {
            console.log('bundle load error', bundle.path, err);
        }
    }
    GameService.startMatchmaking();
    GameService.mainLoop();
    // console.log('collections', GameService.collections('game').all());
};

run();