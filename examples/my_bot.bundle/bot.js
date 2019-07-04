const aliveStrategy = require('./alive-strategy.js');
let cli;

function setup(client) {
    // to some stuff, then connects
    client.connect("SNK b3n");
    client.on('game_found', matchmaking => {
        cli.log('game found');
        matchmaking.accept(client);
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
    cli = client;
}

module.exports = {
    ready: client => {
        client.log('hello world =)');
        setup(client);
    },
    load: matchmaking => {
        cli.log('matchmacking started');
    },
    start: player => {
        cli.log('start');
        player.behavior.while(['alive'], aliveStrategy(player.behavior), () => {
            cli.log('Oups i\'m dead Oo');
        });
    },
    update: time => {
    }
};
