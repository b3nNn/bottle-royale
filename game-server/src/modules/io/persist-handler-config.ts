class PersistHandlerConfig {
    public debug: boolean;
    
    constructor(options: any) {
        this.debug = (options.debug !== undefined ? true : false);
    }
}

export default PersistHandlerConfig;