const path= require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzer=require('webpack-bundle-analyzer').BundleAnalyzerPlugin
require('dotenv').config()

module.exports={
    mode: "production",
    entry: {
        bundle:path.resolve(__dirname,'static','app','script.js'),

    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'static','dist'),
        clean: true,
        assetModuleFilename: "[name][ext]",
        publicPath: `http://${process.env.HOST}:${process.env.APP_PORT}/resource/dist/`
    },
    devtool:'source-map',
    // devServer: {
    //     static:{
    //         directory:path.join(__dirname,'static','dist')
    //     },
    //     port:3030,
    //     open:true,
    //     hot:true,
    //     compress:true,
    //     historyApiFallback:true,
    // },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "rainyCloud - Home",
            filename: "index.html",
            template: "webpack/template.html"
        }),
        // new BundleAnalyzer(),
    ]
}