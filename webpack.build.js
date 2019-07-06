require('custom-env').env('', '../');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'development',
    entry: {
        app: "./src/app.js"
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
            },
            {
                test: /\.html$/,
                use: [ {
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }
            ],
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        },
        // {
        //     test: /\.coffee$/,
        //     use: [ {
        //         loader: 'coffee-loader',
        //         options: { 
        //           transpile: {
        //             presets: ['env']
        //           }
        //         }
        //     }]
        // }
        ]
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
            Dropzone: 'dropzone',
            Util: "exports-loader?Util!bootstrap/js/dist/util",
            Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
        }),
        new webpack.DefinePlugin({
            CFG_CLIENT_HTTP_PORT: (process.env.CLIENT_HTTP_PORT !== undefined ? `"${process.env.CLIENT_HTTP_PORT}"` : '"http://localhost:8080"')
        }),
        new webpack.NamedModulesPlugin(),
    ],
};