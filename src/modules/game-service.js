import _ from 'lodash';
import nanoid from 'nanoid';
import GameCollections from './game-collections';

const Collections = GameCollections();

const Sandbox = {
    registerListener: (client, event, callback) => {
        console.log('push tesssst');
        
    }
}

class GameService {
    constructor() {
        this.sandbox = Sandbox;
        this.collections = Collections;
    }

    createClient(app) {
        const client = new GameClient();
        client.ID = this.collections('lobby').uid();
        this.registerClient(client, app);
        return client;
    }

    registerClient(client, app) {
        this.collections('lobby').push('client_identity', {
            clientID: client.ID,
            longID: client.longID
        });
        this.collections('game').push('client_app', {
            clientID: client.ID,
            app
        });
    }

    setupGameClients() {
        _.each(this.collections('game').kind('client_app'), client => {
            client.app.prepare();
        });
    }

    joinPlayer(clientID) {
        this.collections('game').push('client_ready', {
            clientID: clientID
        });
    }

    startMatchmaking() {
        const game = {
            accept: () => {
                console.log(`[${game.clientID}] matchmacking accepted`);
                this.joinPlayer(game.clientID);
            },
            reject: () => {}
        };
        this.eventEach('game_found', listener => {
            game.clientID = listener.clientID;
            listener.callback(game);
        });
        this.eventEach('before_game_load', listener => {
            listener.callback();
        });
        this.eventEach('after_game_load', listener => {
            listener.callback();
        });
    }

    eventEach(event, callback) {
        _.each(this.collections('game').kind('listener').filter(item => {
            return item.event == event;
        }), listener => {
            callback(listener);
        });
    }

    raiseEvent(event, params) {
        _.each(this.collections('game').kind('listener').filter(item => {
            return item.event == event;
        }), listener => {
            listener.callback(params);
        });
    }

    mainLoop(run = true) {
        if (run) {
            console.log('update mainLoop');
            setTimeout(() => this.mainLoop(true), 500);
        }
    }
}

class GameClient {
    constructor() {
        this.longID = nanoid();
    }

    connect(nickname) {
        console.log(`[${this.longID}] ${nickname} is connected`);
    }

    on(event, callback) {
        console.log(`[${this.longID}] listener init ${this.ID}:${event}`);
        Collections('game').push('listener', {
            clientID: this.ID,
            event,
            callback
        });
    }

    off(event) {

    }

    log(str) {
        console.log(`[${this.longID}] ${str}`);
    }
}

export { GameService };