import _ from 'lodash';

class Application {
    constructor(argv) {
        this.argv = argv;
        this.middlewares = {};
        this.services = {};
        this.middlewareDefinitions = [];
    }

    middleware(name, provider) {
        this.middlewareDefinitions.push({
            name,
            provider
        });
    }

    getInjectArguments(provider) {
        const args = [];

        if (provider.$inject) {
            for (let inject of provider.$inject) {
                if (this.services[inject]) {
                    args.push(this.services[inject]);
                } else {
                    throw new Error(`unknown service provider ${inject}`);
                }
            }
        }
        return args;
    }

    async init() {
        try {
            for (let def of this.middlewareDefinitions) {
                if (_.isFunction(def.provider.constructor)) {
                    def.provider.constructor.call(this, this.getInjectArguments(def.provider));
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async run() {
        this.init();
    }
}

export default Application;