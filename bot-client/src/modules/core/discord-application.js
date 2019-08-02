import ScriptedApplication from './scripted-application';

class DiscordApplication extends ScriptedApplication {
    constructor(script) {
        super(script);
    }

    setup(client, namespace) {
        this.setupVM(namespace);
    }
}

export default DiscordApplication;