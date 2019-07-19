import _ from 'lodash';
import ClockTick from '../components/clock-tick';
import { toSeconds } from '../modules/game/time';

class DevServer {
    constructor(App, GameServer, GameEngine) {
        this.app = App;
        this.gameServer = GameServer;
        this.engine = GameEngine;
        this.debugPerfs = App.argv['show-perfs'] || false;
        this.debugTick = new ClockTick(toSeconds(5));
    }

    async run() {
        this.app.events.on('bundles:loaded', async bundles => {
            await this.gameServer.addBundles(_.clone(bundles));
            await this.gameServer.init();
            await this.gameServer.startMatchmaking();
            // console.log('TEST', this.collections('game').all());
        });
    }

    async update(time) {
        const behaviors = this.gameServer.collections('game').kind('behavior')
        // console.log('up');
        this.engine.update(time);
        _.each(behaviors, client => {
            client.behavior.update(time);
        });
        this.debugTick.each(() => {
            if (this.debugPerfs) {
                console.log('loop time:', Math.round(time.prefs.updateTime), 'usage:', `${Math.round(time.prefs.usage)}%`, 'total:', Math.round(time.total / 1000000));
            }
        });
    }
}

DevServer.$inject = ['App', 'GameServer', 'GameEngine'];

export default DevServer;
