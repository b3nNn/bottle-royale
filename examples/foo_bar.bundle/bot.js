const client = require('game-client');
const player = require('game-player');

client.connect("foo_bar");
client.on('game_found', matchmaking => {
    client.log('game found', client);
    matchmaking.accept(client);
    matchmaking.on('load', () => {
        const strategy = player.behavior.createStrategy('empty-strategy');
    
        player.behavior.while(['alive'], strategy, () => {
            client.log('WTF i\'m dead too');
        });
    });
});
