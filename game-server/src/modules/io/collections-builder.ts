import _ from 'lodash';
import ApplicationConfig from '../core/application-config';
import Collections from './collections';
import CollectionsConfig from './collections-config';
import PersistHandlerConfig from './persist-handler-config';

class CollectionsBuilder {
    private collections: any[];
    private config: CollectionsConfig;
    
    constructor(collections: any[], config: CollectionsConfig) {
        this.collections = collections;
        this.config = config;
        this.build = this.build.bind(this);
    }

    async init(appConfig: ApplicationConfig) {
        const config = new PersistHandlerConfig(_.assign(_.clone(appConfig), this.config));

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

export default CollectionsBuilder;