import BotBundleLoader from '../modules/bundle/bot-bundle-loader';

class BundlesServices {
    constructor() {
        this.bundles = [];
    }

    async loadBundles(bundles) {
        for (let bundleFilename of bundles) {
            this.bundles.push(await BotBundleLoader.loadFromPath(bundleFilename));
        };
        return this.bundles;
    }
}

export default BundlesServices;
