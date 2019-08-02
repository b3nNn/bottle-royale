import BotApplication from '../core/bot-application';
import DiscordApplication from '../core/discord-application';
import BootableApplication from '../core/bootable-application';

class BotBundle {
    constructor(path, scripts) {
        this.path = path;
        this.apps = {};
        this.scripts = scripts;
    }

    load() {
        this.apps = {
            bot: new BotApplication(this.scripts.bot, `${process.cwd()}/${this.path}/bot.js`, `${process.cwd()}/${this.path}`),
            boot: new BootableApplication(this.scripts.boot, `${process.cwd()}/${this.path}/boot.js`, `${process.cwd()}/${this.path}`),
            discord: new DiscordApplication(this.scripts.discord)
        };
    }

    setup(client, namespace) {
        this.apps.bot.setup(client, namespace);
        this.apps.boot.setup(client, namespace);
        this.apps.discord.setup(client, namespace);
    }

    compile() {
        try {
            this.apps.bot.compile();
            this.apps.boot.compile();
            this.apps.discord.compile();
        } catch (err) {
            throw err;
        }
    }
}

export default BotBundle;