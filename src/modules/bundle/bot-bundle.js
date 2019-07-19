import BotApplication from '../core/bot-application';
import DiscordApplication from '../core/discord-application';

class BotBundle {
    constructor(path, scripts) {
        this.path = path;
        this.apps = {};
        this.scripts = scripts;
    }

    load() {
        this.apps = {
            bot: new BotApplication(this.scripts.bot, `${process.cwd()}/${this.path}/bot.js`, `${process.cwd()}/${this.path}`),
            discord: new DiscordApplication(this.scripts.discord)
        };
    }

    compile() {
        return this.apps.bot.compile();
    }
}

export default BotBundle;