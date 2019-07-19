import _ from 'lodash';
import Clock from '../components/clock';
import { toSeconds, toMinutes } from '../modules/game/time';

class GameEngineService {
    constructor(collections, eventsFactory, stormService, vehiculesService, mapService, gameObjectService, matchmakingService) {
        this.gameServer = null;
        this.collections = collections;
        this.events = eventsFactory.createProvider('game_engine_service_listener');
        this.config = {
            death_delay: toMinutes(5)
        };
        this.tick = new Clock();
        this.eventTriggers = {};
        this.storm = stormService;
        this.vehicules = vehiculesService;
        this.map = mapService;
        this.go = gameObjectService;
        this.matchmaking = matchmakingService;
        this.isRunning = false;
    }

    configure(config) {
        this.debug = config.debug;
    }

    init(gameServer) {
        this.gameServer = gameServer;
        this.go.init(this.gameServer);
        this.storm.init(this.gameServer);
    }

    initMap (matchmaking) {
        const travelPlane = this.vehicules.createTravelPlane();
        const planeGO = this.go.instanciate(travelPlane);

        if (planeGO) {
            planeGO.transform.setPosition(this.map.dropTravelPath.start.x * this.map.worldSize.x, this.map.dropTravelPath.start.y * this.map.worldSize.y, 0);
            planeGO.transform.setRotation(this.map.dropTravelPath.vector.x, this.map.dropTravelPath.vector.y, 0);
            const players = matchmaking.getPlayers();
            _.each(players, (player, idx) => {
                let go = this.go.instanciate(player.player);
                go.parent = planeGO;
                travelPlane.enterPlayer(idx, player.player);
            });
        } else {
            throw new Error('World initialisation error');
        }
    }

    execPlayerAction(player, action, params) {
        let vehicule;
        switch (action) {
            case 'eject': {
                if (player.vehicule && player.vehicule.exitPlayer) {
                    vehicule = player.vehicule;
                    player.gameObject.transform.position = _.clone(vehicule.gameObject.transform.position);
                    player.gameObject.parent = null;
                    vehicule.exitPlayer(player);
                    this.collections('game').filterOneUpdate('behavior', be => be.behaviorID === player.behavior.ID, cli => {
                        cli.behavior.addTag('landed');
                    });
                    this.events.fireFilter('landed', listener => listener.params.clientID === player.client.ID);
                }
                break;
            }
            default:
                break;
        }
    }

    start(matchmaking) {
        this.initMap(matchmaking);
        this.tick.start();
        this.matchmaking.events.fire('start');
        this.events.fire('matchmaking:start', matchmaking);
        this.collections('game').kindUpdate('behavior', cli => {
            cli.behavior.addTag('alive');
        });
        this.storm.start();
        this.isRunning = true;
    }

    update(time) {
        const ms = time.total;

        this.storm.update(time);
        this.go.update(time);
        if (!this.eventTriggers.death && ms > this.config.death_delay) {
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

GameEngineService.$inject = ['Collections', 'EventsFactory', 'Storm', 'Vehicules', 'Map', 'GameObjects', 'Matchmaking'];

export default GameEngineService;