import _ from 'lodash';
import Clock from '../../components/clock';
import { GameService } from '../../services/game-service';
import { GameObject } from './game-object';

class GameEngine {
    constructor(collections, eventService, stormService, vehiculesService, mapService, gameObjectService) {
        this.collections = collections;
        this.events = eventService;
        this.config = {
            land_delay: 30000,
            death_delay: 90000
        };
        this.tick = new Clock();
        this.eventTriggers = {};
        this.storm = stormService;
        this.vehicules = vehiculesService;
        this.map = mapService;
        this.go = gameObjectService;
        this.isRunning = false;
    }

    initMap () {
        const travelPlane = this.vehicules.createTravelPlane();
        const planeGO = GameObject.instantiate(travelPlane);
        planeGO.transform.setPosition(this.map.dropTravelPath.start.x, this.map.dropTravelPath.start.y, 0);
        planeGO.transform.setRotation(this.map.dropTravelPath.vector.x, this.map.dropTravelPath.vector.y, 0);
        const players = GameService.matchmaking.getPlayers();
        _.each(players, (player, idx) => {
            travelPlane.enterPlayer(idx, player.player);
        });
    }

    start() {
        this.initMap();
        this.tick.start();
        GameService.matchmaking.events.fire('start');
        this.events.fire('matchmaking_start');
        this.collections('game').kindUpdate('behavior', cli => {
            cli.behavior.addTag('alive');
        });
        this.storm.start();
        this.isRunning = true;
    }

    update(time) {
        const ms = time.total / 1000;

        this.storm.update(time);
        this.go.update(time);
        if (!this.eventTriggers.landed && ms > this.config.land_delay) {
            this.collections('game').kindUpdate('behavior', cli => {
                cli.behavior.addTag('landed');
            });
            this.events.fire('landed');
            this.eventTriggers.landed = true;
        } else if (!this.eventTriggers.death && ms > this.config.death_delay) {
            this.tick.stop();
            this.collections('game').kindUpdate('behavior', cli => {
                cli.behavior.setTags(['landed', 'dead']);
            });
            this.events.fire('death');
            this.eventTriggers.death = true;
            this.isRunning = false;
        }
    }
}

export default GameEngine;