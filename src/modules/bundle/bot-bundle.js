import BotApplication from './bot-application';
import DiscordApplication from './discord-application';

class BotBundle {
    constructor(path, scripts) {
        this.path = path;
        this.apps = {
            bot: new BotApplication(scripts.bot, `${process.cwd()}/${this.path}/bot.js`, `${process.cwd()}/${this.path}`),
            discord: new DiscordApplication(scripts.discord)
        };
        this.scripts = scripts;
    }

    compile() {
        return this.apps.bot.compile();
    }
}

export default BotBundle;