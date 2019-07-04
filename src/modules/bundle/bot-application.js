import _ from 'lodash';
import GameService from '../../services/game-service';
import ScriptedApplication from './scripted-application';
import BotRuntimeProxy from './bot-runtime-proxy';

class BotApplication extends ScriptedApplication {
    constructor(script, path, dir) {
        super(script, path, dir);
        this.client = GameService.clients.createClient(this);
        this.player = GameService.clients.createPlayer(this.client);
        this.proxy = new BotRuntimeProxy();
    }

    loadRuntime(runtime) {
        this.proxy.setRuntime(runtime);
    }

    ready() {
        try {
            this.proxy.ready(this.client);
        } catch(err) {
            console.error(this.toScriptingError(err));
        }
    }

    load(matchmaking) {
        try {
            this.proxy.load(matchmaking);
        } catch(err) {
            console.error(this.toScriptingError(err));
        }
    }

    start() {
        try {
            this.proxy.start(this.player);
        } catch(err) {
            console.error(this.toScriptingError(err));
        }
    }

    update(time) {
        try {
            this.proxy.update(time);
        } catch(err) {
            console.error(this.toScriptingError(err));
        }
    }
}

export default BotApplication;