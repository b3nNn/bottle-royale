import _ from 'lodash';
import Clock from '../../components/clock';
import GameService from '../../services/game-service';

class GameEngine {
    constructor(collections, eventService) {
        this.collections = collections;
        this.events = eventService;
        this.config = {
            land_delay: 30000,
            death_delay: 60000
        };
        this.tick = new Clock();
        this.eventTriggers = {};
        this.isRunning = false;
    }

    start() {
        this.tick.start();
        GameService.matchmaking.events.each('start', listener => {
            listener.callback();
        });
        this.events.each('matchmaking_start', listener => {
            listener.callback();
        });
        _.each(this.collections('runtime').kind('client_behavior'), cli => {
            cli.behavior.addTag('alive');
        });
        this.isRunning = true;
    }

    update(time) {
        const ms = time.total / 1000;
        if (!this.eventTriggers.landed && ms > this.config.land_delay) {
            _.each(this.collections('runtime').kind('client_behavior'), cli => {
                cli.behavior.addTag('landed');
            });
            this.events.each('landed', listener => {
                listener.callback();
            });
            this.eventTriggers.landed = true;
        } else if (!this.eventTriggers.death && ms > this.config.death_delay) {
            this.tick.stop();
            _.each(this.collections('runtime').kind('client_behavior'), cli => {
                cli.behavior.setTags(['landed', 'dead']);
            });
            this.events.each('death', listener => {
                listener.callback();
            });
            this.eventTriggers.death = true;
            this.isRunning = false;
        }
    }
}

export default GameEngine;