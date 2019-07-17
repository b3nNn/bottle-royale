import _ from 'lodash';

class DevServer {
    constructor(App, GameServer) {
        this.app = App;
        this.gameServer = GameServer;
    }

    async run() {
        this.app.events.on('bundles:inlines_loaded', async bundles => {
            await this.gameServer.addBundles(_.clone(bundles));
            await this.gameServer.init();
        });
    }

    async update(time) {
        
    }
}

DevServer.$inject = ['App', 'GameServer'];

export default DevServer;
