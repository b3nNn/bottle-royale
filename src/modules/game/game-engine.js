import _ from 'lodash';

class GameEngine {
    constructor(collections) {
        this.collections = collections;
    }

    start() {
        _.each(this.collections('game').kind('client_behavior'), cli => {
            cli.behavior.addTag('alive');
        });
        setTimeout(() => {
            _.each(this.collections('game').kind('client_behavior'), cli => {
                cli.behavior.addTag('landed');
            });
        }, 3000);
        setTimeout(() => {
            _.each(this.collections('game').kind('client_behavior'), cli => {
                cli.behavior.setTags(['landed', 'dead']);
            });
        }, 6000);
    }
}

export default GameEngine;