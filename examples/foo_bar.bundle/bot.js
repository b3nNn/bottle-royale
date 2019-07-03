module.exports = {
    // to some stuff, then connects
    ready: client => {
        client.connect("foo_bar");
        client.on('game_found', game => {
            game.accept();
        });
        client.on('error', err => {
            client.log('error ' + err);
        });
    },
    load: (client, behavior) => {
        const strategy = behavior.createStrategy('empty-strategy');
    
        behavior.while(['alive'], strategy, () => {
            client.log('WTF i\'m dead too');
        });
    }
}