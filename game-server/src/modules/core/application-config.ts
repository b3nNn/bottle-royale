import minimist from 'minimist';

class ApplicationConfig {
    public host: string;
    public debug: boolean;
    public debugPersistence: boolean;

    constructor(argv: minimist.ParsedArgs) {
        this.host = argv['host'];
        this.debug = (argv['debug'] !== undefined ? false : true);
        this.debugPersistence = (argv['debug-persistence'] !== undefined ? false : true);
    }
}

export default ApplicationConfig;