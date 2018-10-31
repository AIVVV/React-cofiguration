const webpack = require('webpack');
const path = require('path');
const sourcePath = path.join(__dirname, './src');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = function(env) {
    const nodeEnv = env && env.prod ? 'production' : 'development';
    const isProd = nodeEnv === 'production';

    const htmlPlugin = new HtmlWebPackPlugin({
        template: './index.html',
        filename: './index.html'
    });

    const environmentPlugin = new webpack.EnvironmentPlugin({
        NODE_ENV: nodeEnv
    });

    const PLUGINS = [htmlPlugin, environmentPlugin];

    if (isProd) {
        PLUGINS.push(
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            }),
            new UglifyJsPlugin({
                uglifyOptions: {
                    warnings: false,
                    ie8: true,
                    compress: {}
                }
            })
        );
    } else {
        PLUGINS.push(new webpack.HotModuleReplacementPlugin());
    }

    return {
        devtool: isProd ? 'source-map' : 'eval',

        context: sourcePath,

        entry: path.join(__dirname, './src/index.js'),

        output: {
            filename: '[name].js',
            path: path.join(__dirname, '/dist')
        },

        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[name]_[local]_[hash:base64]',
                                sourceMap: true,
                                minimize: true
                            }
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
                {
                    test: /\.(woff|woff2|ttf|eot)$/,
                    loader: 'file-loader',
                    options: {
                        name: 'assets/fonts/[name].[hash].[ext]'
                    }
                },
                {
                    test: /\.(png|jpe?g|gif|svg|ico)$/,
                    loader: 'file-loader',
                    options: {
                        name: 'assets/images/[name].[ext]?[hash]'
                    }
                }
            ]
        },

        resolve: {
            extensions: ['.js', '.jsx', '.json'],
            modules: ['node_modules', 'bower_components'],
            descriptionFiles: ['bower.json', 'package.json'],
            mainFields: ['browser', 'module', 'main']
        },

        plugins: PLUGINS,

        devServer: {
            host: 'localhost',
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            contentBase: './dist',
            historyApiFallback: true,
            port: 4000,
            compress: true,
            stats: {
                assets: true,
                children: false,
                chunks: false,
                hash: false,
                modules: false,
                publicPath: false,
                timings: true,
                version: false,
                warnings: true,
                colors: {
                    green: '\u001b[32m'
                }
            }
        }
    };
};
