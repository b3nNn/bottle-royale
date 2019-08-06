import _ from 'lodash';
import ApplicationConfig from '../core/application-config';

class Collections {
    private name: string;
    private collections: any[];
    private config: CollectionsConfig;
    private nextID: number;

    constructor(name: string, collections: any[], config: CollectionsConfig) {
        this.name = name;
        this.collections = collections;
        this.config = config;
        this.nextID = 0;
    }

    updateItem(kind: string, entry: any): void {
        _.each(this.config.persistHandlers, handler => handler.update(this.name, kind, entry));
    };

    uid(): number {
        return ++this.nextID;
    }

    push(kind: string, entry: any): void {
        this.collections.push(_.merge({
            collection: this.name,
            kind: kind
        }, entry));
        _.each(this.config.persistHandlers, handler => handler.push(this.name, kind, entry));
    }

    kind(kind: string): any[] {
        return _.reduce(this.name, (acc: any[], item: any) => {
            if (item.collection === this.name && item.kind === kind) {
                acc.push(item);
            }
            return acc;
        }, []);
    }

    kindUpdate(kind: string, callback: Function) {
        const all = _.reduce(this.collections, (acc: any[], item: any) => {
            if (item.collection === this.name && item.kind === kind) {
                acc.push(item);
            }
            return acc;
        }, []);
        _.each(all, item => {
            callback(item);
            this.updateItem(kind, item);
        });
    }

    filter(kind: string, filter: Function) {
        return _.reduce(this.collections, (acc: any[], item: any) => {
            if (item.collection === this.name && item.kind === kind && filter(item) === true) {
                acc.push(item);
            }
            return acc;
        }, []);
    }

    filterUpdate(kind: string, filter: Function, callback: Function) {
        const res = _.reduce(this.collections, (acc: any[], item: any) => {
            if (item.collection === this.name && item.kind === kind && filter(item) === true) {
                acc.push(item);
            }
            return acc;
        }, []);
        _.each(res, item => {
            if (callback) {
                callback(item);
            }
            this.updateItem(kind, item);
        });
    }

    filterOne(kind: string, filter: Function, callback: Function) {
        const res = _.reduce(this.collections, (acc: any[], item: any) => {
            if (item.collection === this.name && item.kind === kind && filter(item) === true) {
                acc.push(item);
            }
            return acc;
        }, []);
        callback(res.length === 0 ? null : res[0]);
    }

    filterOneUpdate(kind: string, filter: Function, callback: Function) {
        const res = _.reduce(this.collections, (acc: any[], item: any) => {
            if (item.collection === this.name && item.kind === kind && filter(item) === true) {
                acc.push(item);
            }
            return acc;
        }, []);
        callback(res.length === 0 ? null : res[0]);
        this.updateItem(kind, res.length === 0 ? null : res[0]);
    }

    all() {
        return _.reduce(this.collections, (acc: any[], item: any) => {
            if (item.collection === this.name) {
                acc.push(item);
            }
            return acc;
        }, []);
    }
}

class CollectionsConfig {
    public debug: boolean;
    public debugPersistence: boolean;
    public persistHandlers: any[];

    constructor(options: any) {
        this.debug = (options.debug !== undefined ? options.debug : false);
        this.debugPersistence = (options.debugPersistence !== undefined ? options.debugPersistence : false);
        this.persistHandlers = (options.persistHandlers !== undefined ? options.persistHandlers : []);
    }
}

class HandlerConfig {
    public debug: boolean;
    
    constructor(options: any) {
        this.debug = (options.debug !== undefined ? true : false);
    }
}

class Builder {
    private collections: any[];
    private config: CollectionsConfig;
    
    constructor(collections: any[], config: CollectionsConfig) {
        this.collections = collections;
        this.config = config;
        this.build = this.build.bind(this);
    }

    async init(appConfig: ApplicationConfig) {
        const config = new HandlerConfig(_.assign(_.clone(appConfig), this.config));

        for (let handler of this.config.persistHandlers) {
            await handler.init(config);
        }
    }

    configure(config: ApplicationConfig) {
        this.config.debugPersistence = config.debugPersistence || false;
    }

    build(name: string) {
        return new Collections(name, this.collections, this.config);
    }
}

const CollectionsProvider = (options: any): Function => {
    const config = new CollectionsConfig(options);
    const collections: any[] = [];
    const builder = new Builder(collections, config)

    return builder.build;
}

export { CollectionsProvider as GameCollections };