import _ from 'lodash';
import { GameService } from '../../services/game-service';
import ScriptedApplication from './scripted-application';

class BotApplication extends ScriptedApplication {
    constructor(script, path, dir) {
        super(script, path, dir);
        this.client = GameService.clients.createClient();
        GameService.clients.registerClientApp(this.client, this);
        this.setup(this.client);
    }
}

export default BotApplication;