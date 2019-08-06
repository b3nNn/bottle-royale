import IPersistHandler from './ipersist-handler';

class CollectionsConfig {
    public debug: boolean;
    public debugPersistence: boolean;
    public persistHandlers: IPersistHandler[];

    constructor(options: any) {
        this.debug = (options.debug !== undefined ? options.debug : false);
        this.debugPersistence = (options.debugPersistence !== undefined ? options.debugPersistence : false);
        this.persistHandlers = (options.persistHandlers !== undefined ? options.persistHandlers : []);
    }
}

export default CollectionsConfig;