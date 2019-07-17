import _ from 'lodash';

class InlineBundleLoader {
    constructor(App, Bundles) {
        this.app = App;
        this.bundles = Bundles;
        this.loadeds = []
    }

    async run() {
        const bundles = [];
        if (_.isArray(this.app.argv.bot)) {
            bundles = this.app.argv.bot;
        } else if (_.isString(this.app.argv.bot)) {
            bundles.push(this.app.argv.bot);
        }
        console.log('loading bundles', bundles);
        const loadeds = await this.bundles.loadBundles(bundles);
        this.app.events.emit('bundles:inlines_loaded', loadeds);
        this.loadeds = loadeds;
        // try {
        //     await GameService.init({
        //         debug: argv.debug === true,
        //         debugPersistence: argv['debug-persistence'] === true,
        //         host: argv.host || 'localhost'
        //     });
        // } catch(err) {
        //     console.error('fatal error', err);
        //     process.exit(-1);
        // }

    }

    async update(time) {

    }
}

InlineBundleLoader.$inject = ['App', 'Bundles'];

export default InlineBundleLoader;