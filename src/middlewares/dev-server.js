import _ from 'lodash';

class DevServer {
    constructor(App, GameServer, Collections) {
        this.app = App;
        this.gameServer = GameServer;
        this.collections = Collections;
    }

    async run() {
        this.app.events.on('bundles:inlines_loaded', async bundles => {
            await this.gameServer.addBundles(_.clone(bundles));
            await this.gameServer.init();
            await this.gameServer.startMatchmaking();
            console.log('TEST', this.collections('game').all());
        });
    }

    async update(time) {
        
    }
}

DevServer.$inject = ['App', 'GameServer', 'Collections'];

export default DevServer;
