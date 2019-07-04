const aliveStrategy = require('./alive-strategy.js');

function setup(client) {
    // to some stuff, then connects
    client.connect("SNK b3n");
    client.on('game_found', matchmacking => {
        matchmacking.accept();
    });
    client.on('error', err => {
        client.log('error ' + err);
    });
    client.on('before_game_load', game => {
        client.log('before_game_load');
    });
    client.on('after_game_load', game => {
        client.log('after_game_load');
    });
}

module.exports = {
    ready: client => {
        setup(client);
    },
    load: (client, behavior, game) => {
    },
    start: (client, behavior, game) => {
        client.log('start confirmed');
        behavior.while(['alive'], aliveStrategy(behavior), () => {
            client.log('Oups i\'m dead Oo');
        });
    },
    death: (client, behavior, game) => {
        client.log('death confirmed');
    },
    update: (client, behavior, game) => {
    }
};
