const aliveStrategy = require('./alive-strategy.js');
const location = new br.PlayerLocation();
const client = new br.Client();
const storm = new br.StormEvents();
const game = new br.GameEvents();
const player = new br.Player();

client.connect("SNK citizendotexe");
client.log('client connected', JSON.stringify(client));
client.on('game_found', matchmaking => {
    client.log('game found', JSON.stringify(matchmaking));
    matchmaking.accept(client);
    matchmaking.on('load', () => {
        client.log('matchmacking loading');
    });
    matchmaking.on('start', () => {
        storm.on('prepare', storm => {
            client.log('the storm prepare');
        });
        storm.on('stay', storm => {
            client.log('the storm stay');
        });
        storm.on('move', storm => {
            client.log('the storm move');
        });
        client.log(`matchmacking started`);
        client.log('location', location);
        client.log('let\'s have some fun', player.vehicule);
        game.on('landed', () => {
            client.log('landed confirmed');
        });
        game.on('became_active', () => {
            client.log('became_active confirmed');
        });
        player.behavior.while(['alive'], aliveStrategy(client, player, game, location), () => {
            client.log('Oups i\'m dead Oo');
        });
    });
});
