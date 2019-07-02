import GameService from '../../services/game-service';
import ScriptedApplication from './scripted-application';
import BotRuntimeProxy from './bot-runtime-proxy';

class BotApplication extends ScriptedApplication {
    constructor(script, path, dir) {
        super(script, path, dir);
        this.client = GameService.clients.createClient(this);
        this.behavior = GameService.clients.createBehavior(this.client);
        this.proxy = new BotRuntimeProxy();
    }

    loadRuntime(runtime) {
        this.proxy.setRuntime(runtime);
    }

    prepare() {
        this.proxy.ready(this.client);
    }

    load() {
        this.proxy.load(this.client, this.behavior);
    }
}

export default BotApplication;