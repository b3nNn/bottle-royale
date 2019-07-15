import Storm from './storm';
import { GameService } from '../../services/game-service';

class StormService {
    constructor(collections, eventService) {
        this.collections = collections;
        this.events = eventService;
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
            serverID: GameService.serverID,
            stormID: storm.ID,
            storm
        });
        return storm;
    }
}

export default StormService;