const location = require('location');
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
        cli.log('location', location);
        cli.log('matchmacking started');
    },
    start: (player, game) => {
        cli.log('let\'s have some fun');
        game.on('landed', () => {
            cli.log('landed confirmed');
        });
        game.on('became_active', () => {
            cli.log('became_active confirmed');
        });
        player.behavior.while(['alive'], aliveStrategy(cli, player, game, location), () => {
            cli.log('Oups i\'m dead Oo');
        });
    },
    update: time => {
    }
};
