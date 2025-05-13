// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: isProduction,
    },
    devServer: {
        open: true,
        host: '0.0.0.0',
        port: 3000,
    },
    optimization: {
        minimizer: [
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.sharpMinify,
                    filename: 'images/[name][ext]',
                    options: {
                        encodeOptions: {
                            jpeg: {
                                // https://sharp.pixelplumbing.com/api-output#jpeg
                                quality: 100,
                            },
                            webp: {
                                // https://sharp.pixelplumbing.com/api-output#webp
                                lossless: true,
                            },
                            avif: {
                                // https://sharp.pixelplumbing.com/api-output#avif
                                lossless: true,
                            },
                            // png by default sets the quality to 90%, which is same as lossless
                            // https://sharp.pixelplumbing.com/api-output#png
                            png: {
                                quality: 100,
                            },

                            // gif does not support lossless compression at all
                            // https://sharp.pixelplumbing.com/api-output#gif
                            gif: {},
                        }
                    },
                },
            }),
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
        new HtmlWebpackPlugin({
            template: 'src/rsvp/index.html',
            filename: 'rsvp/index.html',
        }),
        new MiniCssExtractPlugin(),
        /* new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/rsvp'),
                    to: 'rsvp'
                },
            ],
        }), */
        /*
        new ImageMinimizerPlugin({
            generator: [
                {
                    type: 'asset',
                    implementation: ImageMinimizerPlugin.sharpMinify,
                    options: {
                        resize: {
                            width: 50, // half of the original size
                            unit: 'percent',
                        },
                    },
                    filename: 'images/[name]@1x[ext]',
                },
                {
                    type: 'asset',
                    implementation: ImageMinimizerPlugin.sharpMinify,
                    options: {
                    },
                    filename: 'images/[name]@2x[ext]',
                }
            ],
        }) */
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpe?g|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]',
                }
            },
            {
                test: /\.html$/i,
                use: [ 'html-loader' ],
            },
        ],
    },
};