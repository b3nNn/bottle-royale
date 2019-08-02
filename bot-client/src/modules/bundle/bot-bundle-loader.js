import fs from 'fs';
import BotBundle from './bot-bundle';

class BotBundleLoader {
    static loadFromPath(path) {
        return new Promise(resolve => {
            let scripts = {
                bot: null,
                discord: null,
                boot: null
            };
            try {
                scripts.bot = fs.readFileSync(`${path}/bot.js`).toString();
            } catch (err) {}
            try {
                scripts.discord = fs.readFileSync(`${path}/discord.js`).toString();
            } catch (err) {}
            try {
                scripts.boot = fs.readFileSync(`${path}/boot.js`).toString();
            } catch (err) {}
            resolve(new BotBundle(path, scripts));
        });
    }
}

export default BotBundleLoader;