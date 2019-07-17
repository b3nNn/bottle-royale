class GameStormEngine {
    constructor(stormService) {
        this.storm = stormService;
    }

    run() {
        console.log('GameStormEngine middleware runnning');
    }

    update(time) {
        console.log('GameStormEngine middleware update', time.total, this.storm.instance);
        this.updateInstance(time);
    }

    updateInstance(time) {
        if (!this.instance) {
            return;
        }
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
}

GameStormEngine.$inject = ['Storm'];

export default GameStormEngine;