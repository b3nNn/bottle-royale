import _ from 'lodash';
import nanoid from 'nanoid';

class Client {
    constructor(service) {
        this.service = service;
        this.longID = nanoid();
        this.nickname = null;
    }

    connect(nickname) {
        this.nickname = nickname;
        this.service.connect(this);
    }

    on(event, callback) {
        console.log('CLIENT ON', event);
        this.service.events.on(event, callback, { clientID: this.ID });
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
            serverID: 0,
            clientID: this.ID,
            longID: this.longID,
            nickname: this.nickname
        }
    }
}

export default Client;
