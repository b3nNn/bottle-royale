import _ from 'lodash';
import minimist from 'minimist';

class ApplicationConfig {
    public host: string;
    public debug: boolean;
    public debugPersistence: boolean;

    constructor(argv: minimist.ParsedArgs) {
        this.host = (_.isString(argv['host']) ? argv['host'] : undefined);
        this.debug = (_.isBoolean(argv['debug']) ? argv['debug'] : false);
        this.debugPersistence = (_.isBoolean(argv['debug-persistence']) ? argv['debug-persistence'] : false);
    }
}

export default ApplicationConfig;