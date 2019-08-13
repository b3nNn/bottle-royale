import _ from 'lodash';
import minimist from 'minimist';

class ApplicationConfig {
    public host: string;
    public debug: boolean;
    public debugPersistence: boolean;

    constructor(argv: minimist.ParsedArgs) {
        this.host = (_.isString(argv['host']) ? argv['host'] : undefined);
        this.debug = (!_.isUndefined(argv['debug']) ? true : false);
        this.debugPersistence = (!_.isUndefined(argv['debug-persistence']) ? true : false);
    }
}

export default ApplicationConfig;