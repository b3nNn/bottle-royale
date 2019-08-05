import _ from 'lodash';
import minimist from 'minimist';
import EventEmitter from 'events';
import ApplicationConfig from './application-config';
import IMiddleware from './imiddleware';
import IService from './iservice';
import ServiceDeclaration from './service-declaration';
import MiddlewareDeclaration from './middleware-declaration';
import { Time } from '../game/time';

class Application {
    public events: EventEmitter;

    private argv: minimist.ParsedArgs;
    private config: ApplicationConfig;
    private middlewares: IMiddleware[];
    private services: Map<string, IService>;
    private serviceDeclarations: ServiceDeclaration[];
    private middlewareDeclarations: MiddlewareDeclaration[];

    constructor(argv: minimist.ParsedArgs) {
        this.argv = argv;
        this.config = new ApplicationConfig(argv);
        this.events = new EventEmitter();
        this.middlewares = [];
        this.services = new Map<string, IService>();
        this.serviceDeclarations = [];
        this.middlewareDeclarations = [];
    }

    service(name: string, provider: Function, constructorParams?: any): void {
        let declaration = new ServiceDeclaration(name, provider, constructorParams);
        this.serviceDeclarations.push(declaration);
    }

    middleware(provider: Function): void {
        const declaration = new MiddlewareDeclaration(provider);
        this.middlewareDeclarations.push(declaration);
    }

    getInjectArguments(provider: any): any[] {
        const args: any = [];

        if (provider.$inject) {
            for (let inject of provider.$inject) {
                if (inject === 'App') {
                    args.push(this);
                } else if (this.services.has(inject)) {
                    args.push(this.services.get(inject));
                } else {
                    throw new Error(`unknown service provider ${inject} from ${provider.name}, got ${JSON.stringify(_.keys(this.services))}`);
                }
            }
        }
        return args;
    }

    async init(): Promise<void> {
        let service: any;

        try {
            for (let def of this.serviceDeclarations) {
                if (_.isFunction(def.provider.constructor) && def.constructorParams) {
                    service = def.provider.call({}, def.constructorParams, ...this.getInjectArguments(def.provider));
                    // this.services.set(def.name, def.provider.call({}, def.constructorParams, ...this.getInjectArguments(def.provider)));
                } else if (_.isFunction(def.provider.constructor)) {
                    service = def.provider.call({}, ...this.getInjectArguments(def.provider));
                    // this.services.set(def.name, def.provider.call({}, ...this.getInjectArguments(def.provider)));
                } else {
                    service = null;
                }

                if (service) { 
                    this.services.set(def.name, service);
                    if (_.isFunction(service.configure)) {
                        service.configure(this.config, this.argv);
                    }
                }
            }
            for (let def of this.middlewareDeclarations) {
                if (_.isFunction(def.provider.constructor) && def.constructorParams) {
                    this.middlewares.push(def.provider.call({}, def.constructorParams, ...this.getInjectArguments(def.provider)));
                } else if (_.isFunction(def.provider)) {
                    this.middlewares.push(def.provider.call({}, ...this.getInjectArguments(def.provider)));
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async run(callback: Function): Promise<void> {
        await this.init();
        _.each(this.middlewares, async middleware => await middleware.run());
        if (callback) {
            await callback(...this.getInjectArguments(callback));
        }
    }

    async update(time: Time) {
        _.each(_.values(this.middlewares), async middleware => await middleware.update(time));
    }
}

export default Application;