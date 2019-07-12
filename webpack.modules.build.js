require('custom-env').env('', '../');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'development',
    entry: {
        'client': './src/modules/runtime-modules/client.js',
        'player': './src/modules/runtime-modules/player.js',
        'location': './src/modules/runtime-modules/player-location.js',
        'storm-events': './src/modules/runtime-modules/storm.js',
        // 'client': './src/modules/runtime-modules/client.js',
        // 'client': './src/modules/runtime-modules/client.js',
        // 'client': './src/modules/runtime-modules/client.js',
        // 'client': './src/modules/runtime-modules/client.js',
        // 'client': './src/modules/runtime-modules/client.js',
        // 'client': './src/modules/runtime-modules/client.js',
        // 'client': './src/modules/runtime-modules/client.js',
        'game-events': './src/modules/runtime-modules/game-events.js',
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/modules'),
    },
    plugins: [
        // new CleanWebpackPlugin(['dist']),
        // new webpack.NamedModulesPlugin(),
    ],
};