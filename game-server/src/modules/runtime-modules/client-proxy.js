import _ from 'lodash';

const ClientProxy = (client, __proto__) => {
    const scope = {
        __proto__,
        get ID() {
            return client.ID;
        },
        get nickname() {
            return client.nickname;
        },
        connect: new Proxy(nickname => {
            client.connect(nickname);
        }, {
            apply: function(target, thisArg, argumentsList) {
                return target(...argumentsList);
            }
        }),
        on: new Proxy((event, callback) => {
            client.on(event, callback);
        }, {
            apply: function(target, thisArg, argumentsList) {
                return target(...argumentsList);
            }
        }),
        off: new Proxy(event => {
            client.off(event);
        }, {
            apply: function(target, thisArg, argumentsList) {
                return target(...argumentsList);
            }
        }),
        log: new Proxy((str, additionnals) => {
            client.log(str, additionnals);
        }, {
            apply: function(target, thisArg, argumentsList) {
                return target(...argumentsList);
            }
        })
    };
    const proxy = new Proxy(scope, {
        get(obj, prop) {
            return obj[prop];
        },
        set(obj, prop, value, receiver) {
            throw new Error(`module 'client' is read only, cannot edit ${prop}`);
            return false;
        }
    });
    return proxy;
}

export default ClientProxy;