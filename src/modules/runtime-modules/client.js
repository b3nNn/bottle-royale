import _ from 'lodash';
import nanoid from 'nanoid';
import { GameService } from '../../services/game-service';

class Client {
    constructor() {
        this.longID = nanoid();
        this.nickname = null;
    }

    connect(nickname) {
        this.nickname = nickname;
        // GameService.collections('game').filterOneUpdate('client', item => item.clientID === this.ID, client => {
        //     if (client) {
        //         client.nickname = nickname;
        //     }
        // });
    }

    on(event, callback) {
        // GameService.clients.events.on(event, callback, { clientID: this.ID });
    }

    off(event) {
        // GameService.clients.events.off(event);
    }

    log(str, additionnal) {
        // if (GameService.debug) {
            console.log(`[client:${this.longID}] ${str}`, additionnal || '');
        // }
    }

    serialize() {
        return {
            serverID: GameService.serverID,
            clientID: this.ID,
            longID: this.longID,
            nickname: this.nickname
        }
    }
}

export default Client;
