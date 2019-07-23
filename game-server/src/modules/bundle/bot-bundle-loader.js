import fs from 'fs';
import BotBundle from './bot-bundle';

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

export default BotBundleLoader;