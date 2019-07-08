module.exports = (client, player, game) => {
    const strategy = player.behavior.createStrategy('survive-strategy');
    
    strategy.on('act', params => {
    });
    return strategy;
};