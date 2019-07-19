import _ from 'lodash';

class InlineBundleLoader {
    constructor(App, Bundles) {
        this.app = App;
        this.bundles = Bundles;
        this.loadeds = []
    }

    async run() {
        const bundles = _.concat([], this.app.argv.bot);
        const loadeds = await this.bundles.loadBundles(bundles);
        this.app.events.emit('bundles:loaded', loadeds);
        this.loadeds = loadeds;
    }

    async update(time) {}
}

InlineBundleLoader.$inject = ['App', 'Bundles'];

export default InlineBundleLoader;