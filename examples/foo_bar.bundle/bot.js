const client = new br.Client();
const player = new br.Player();

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
