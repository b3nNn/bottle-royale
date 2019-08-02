import _ from 'lodash';
import ScriptedApplication from './scripted-application';

class BotApplication extends ScriptedApplication {
    constructor(script, path, dir) {
        super(script, path, dir);
    }

    setup(client, namespace) {
        this.client = client;
        this.namespace = namespace;
        this.setupVM(this.namespace);
    }
}

export default BotApplication;