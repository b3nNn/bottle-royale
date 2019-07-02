import fs from 'fs';
import GameService from '../services/game-service';

const { NodeVM, VMScript } = require('vm2');

class BotBundleLoader {
    static loadFromPath(path) {
        return new Promise((resolve, reject) => {
            let scripts = {
                bot: null,
                discord: null
            };
            try {
                scripts.bot = fs.readFileSync(`${path}/bot.js`).toString();
            } catch (err) {}
            try {
                scripts.discord = fs.readFileSync(`${path}/discord.js`).toString();
            } catch (err) {}
            resolve(new BotBundle(path, scripts));
        });
    }
}

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

class ScriptedApplication {
    constructor(script, path, dir) {
        this.path = path;
        this.dir = dir;
        this.script = script;
        this.compiled = null;
        this.runtime = null;
        this.vm = new NodeVM({
            console: 'inherit',
            sandbox: GameService.sandbox,
            require: {
                external: true,
                builtin: ['path'],
                root: this.dir,
                mock: {
                    fs: {
                        readFileSync() { return 'Nice try!'; }
                    }
                }
            }
        });
    }

    compile() {
        return new Promise((resolve, reject) => {
            try {
                this.compiled = new VMScript(this.script);
                console.log('runtime path', this.path);
                this.runtime = this.vm.run(this.compiled, this.path);
                resolve(this);
            } catch (err) {
                console.error('Failed to compile script.', err);
                reject(err);
            }
        });
    }
}

class BotApplication extends ScriptedApplication {
    constructor(script, path, dir) {
        super(script, path);
        this.client = GameService.createClient(this);
        this.behavior = GameService.createBehavior(this.client);
    }

    prepare() {
        this.runtime.ready(this.client);
    }

    load() {
        if (this.runtime.load) {
            this.runtime.load(this.client, this.behavior);
        }
    }
}

class DiscordApplication extends ScriptedApplication {
    constructor(script) {
        super(script);
    }    
}

export { BotBundleLoader, BotBundle };