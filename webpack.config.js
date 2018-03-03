const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var extractCss = new ExtractTextPlugin('css/style.css');
var htmlWebpackPluginConfig = new HtmlWebpackPlugin( {
    template: __dirname + '/src/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    
    watch: true,

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: extractCss.extract({ use: 'css-loader' })
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader'
            }
        ]
    },

    plugins: [
        htmlWebpackPluginConfig,
        extractCss,
        new CopyWebpackPlugin( [
            { from: './src/img', to: './img/'}, 
            { from: './src/data', to: './data/' },
            { from: './src/audio', to: './audio/' }
        ] )
    ]
};