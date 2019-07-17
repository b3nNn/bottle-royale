import _ from 'lodash';

class InlineBundleLoader {
    constructor(App) {
        this.app = App;
    }

    run() {
        const bundles = [];
        if (_.isArray(this.app.argv.bot)) {
            bundles = this.app.argv.bot;
        } else if (_.isString(this.app.argv.bot)) {
            bundles.push(this.app.argv.bot);
        }

        console.log('loading bundles', bundles);
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

    update(time) {

    }
}

InlineBundleLoader.$inject = ['App'];

export default InlineBundleLoader;