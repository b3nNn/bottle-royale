import _ from 'lodash';
import EventEmitter from 'events';

class Application {
    constructor(argv) {
        this.argv = argv || {};
        this.config = {
            host: this.argv.host,
            debug: this.argv.debug,
            debugPersistence: this.argv['debug-persistence']
        };
        this.events = new EventEmitter();
        this.middlewares = [];
        this.services = {};
        this.serviceDefinitions = [];
        this.middlewareDefinitions = [];
    }

    service(name, provider, constructorParams) {
        this.serviceDefinitions.push({
            name,
            provider,
            constructorParams
        });
    }

    middleware(provider) {
        this.middlewareDefinitions.push({
            provider
        });
    }

    getInjectArguments(provider) {
        const args = [];

        if (provider.$inject) {
            for (let inject of provider.$inject) {
                if (inject === 'App') {
                    args.push(this);
                } else if (this.services[inject]) {
                    args.push(this.services[inject]);
                } else {
                    throw new Error(`unknown service provider ${inject} from ${provider.name}, got ${JSON.stringify(_.keys(this.services))}`);
                }
            }
        }
        return args;
    }

    async init() {
        try {
            for (let def of this.serviceDefinitions) {
                if (_.isFunction(def.provider.constructor) && def.constructorParams) {
                    this.services[def.name] = new def.provider(def.constructorParams, ...this.getInjectArguments(def.provider));
                } else if (_.isFunction(def.provider.constructor)) {
                    this.services[def.name] = new def.provider(...this.getInjectArguments(def.provider));
                }
                if (this.services[def.name] && _.isFunction(this.services[def.name].configure)) {
                    this.services[def.name].configure(this.config, this.argv);
                }
            }
            for (let def of this.middlewareDefinitions) {
                if (_.isFunction(def.provider.constructor) && def.constructorParams) {
                    this.middlewares.push(new def.provider(def.constructorParams, ...this.getInjectArguments(def.provider)));
                } else if (_.isFunction(def.provider)) {
                    this.middlewares.push(new def.provider(...this.getInjectArguments(def.provider)));
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async run(callback) {
        await this.init();
        _.each(this.middlewares, async middleware => await middleware.run());
        if (callback) {
            await callback(...this.getInjectArguments(callback));
        }
    }

    async update(time) {
        _.each(_.values(this.middlewares), middleware => middleware.update(time));
    }
}

export default Application;