import _ from 'lodash';
import nanoid from 'nanoid';

class Client {
    constructor(service) {
        this.service = service;
        this.longID = nanoid();
        this.nickname = null;
        // console.log('CLIENT()', service, this.service);
    }

    connect(nickname) {
        // console.log('CONNECT CLIENT', nickname, this.service);
        this.nickname = nickname;
        this.service.connect(this);
    }

    on(event, callback) {
        this.service.events.on(event, callback, { clientID: this.ID });
    }

    off(event) {
        this.service.event.off(event, { clientID: this.ID });
    }

    log(str, additionnal) {
        if (this.service.debugClients) {
            console.log(`[client:${this.longID}] ${str}`, additionnal || '');
        }
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
