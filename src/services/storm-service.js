import Storm from '../modules/game/storm';

class StormService {
    constructor(collections, eventsFactory, gameServer) {
        this.collections = collections;
        this.events = eventsFactory.createProvider('storm_service_listener');
        this.gameServer = gameServer;
        this.instance = null;
        this.expireAt = null;
    }

    start() {
        this.instance = this.createStorm();
    }

    update(time) {
        switch (this.instance.state) {
            case 'init': {
                if (time.total > this.instance.beginDelay) {
                    this.instance.prepare();
                    this.collections('game').filterOneUpdate('storm', item => item.stormID === this.instance.ID, storm => {
                        storm.storm.state = this.instance.state;
                    });
                    this.events.fire('prepare', this.instance.clientProxy);
                    this.expireAt = this.instance.beginDelay + this.instance.prepareDelay;
                }
                break;
            }
            case 'prepare': {
                if (time.total > this.expireAt) {
                    this.instance.move();
                    this.collections('game').filterOneUpdate('storm', item => item.stormID === this.instance.ID, storm => {
                        storm.storm.state = this.instance.state;
                    });
                    this.events.fire('move', this.instance.clientProxy);
                    this.expireAt = this.expireAt + this.instance.moveDelay;
                }
            }
            case 'move': {
                if (time.total > this.expireAt) {
                    this.instance.stay();
                    this.collections('game').filterOneUpdate('storm', item => item.stormID === this.instance.ID, storm => {
                        storm.storm.state = this.instance.state;
                    });
                    this.events.fire('stay', this.instance.clientProxy);
                    this.expireAt = this.expireAt + this.instance.stayDelay;
                }
            }
            case 'stay': {
                if (time.total > this.expireAt) {
                    this.instance.levelUp();
                    this.instance.prepare();
                    this.collections('game').filterOneUpdate('storm', item => item.stormID === this.instance.ID, storm => {
                        storm.storm.state = this.instance.state;
                        storm.storm.level = this.instance.level;
                    });
                    this.events.fire('prepare', this.instance.clientProxy);
                    this.expireAt = this.expireAt + this.instance.moveDelay;
                }
            }
            default:
                break;
        }
    }

    createStorm() {
        const storm = new Storm();
        storm.ID = this.collections('game.storm').uid();
        this.collections('game').push('storm', {
            serverID: this.gameServer.ID,
            stormID: storm.ID,
            storm
        });
        return storm;
    }
}

StormService.$inject = ['Collections', 'EventsFactory', 'GameServer'];

export default StormService;