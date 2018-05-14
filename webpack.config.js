// docs: http://webpack.github.io/docs/configuration.html
'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const entry = ['whatwg-fetch', './src/index'];
const plugins = [
    new ExtractTextPlugin('bundle.css', { allChunks: true }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        },
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
];

if (process.env.NODE_ENV === 'development') {
    entry.push('webpack-dev-server/client?http://localhost:3000');
    entry.push('webpack/hot/only-dev-server');
    plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
    entry,

    resolve: {
        extensions: ['.scss', '.css', '.js', '.jsx', '.json'],
    },

    output: {
        path: path.join(__dirname, 'dist/public'),
        filename: 'bundle.js',
        publicPath: '/static/',
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                include: path.join(__dirname, 'src'),
            },
            // {
            //     test: /(\.scss)$/,
            //     loader: ExtractTextPlugin.extract({
            //         fallback: 'style-loader',
            //         use: [
            //             {
            //                 loader: 'css-loader',
            //                 options: {
            //                     sourceMap: true,
            //                     modules: true,
            //                     importLoaders: 1,
            //                     localIdentName: '[name]__[local]___[hash:base64:5]',
            //                 },
            //             },
            //             {
            //                 loader: 'sass-loader',
            //                 options: {
            //                     // data: '@import "theme/_config.scss";',
            //                     includePaths: [
            //                         path.resolve(__dirname, './src'),
            //                         path.resolve(__dirname, './node_modules/patternfly-react/dist/sass'),
            //                         path.resolve(__dirname, './node_modules/patternfly/dist/sass'),
            //                         path.resolve(__dirname, './node_modules/bootstrap-sass/assets/stylesheets'),
            //                         path.resolve(__dirname, './node_modules/font-awesome-sass/assets/stylesheets'),
            //                     ],
            //                 },
            //             },
            //         ],
            //     }),
            // },
            // {
            //     test: /\.css$/,
            //     loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }),
            // },
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use a plugin to extract that CSS to a file, but
            // in development "style" loader enables hot editing of CSS.
            {
                test: /\.css$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            sourceMap: true,
                            //modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]__[local]___[hash:base64:5]',
                        },
                    },
                    // {
                    //     loader: require.resolve('postcss-loader'),
                    //     options: {
                    //         // Necessary for external CSS imports to work
                    //         // https://github.com/facebookincubator/create-react-app/issues/2677
                    //         ident: 'postcss',
                    //         plugins: () => [
                    //             require('postcss-flexbugs-fixes'),
                    //             autoprefixer({
                    //                 browsers: [
                    //                     '>1%',
                    //                     'last 4 versions',
                    //                     'Firefox ESR',
                    //                     'not ie < 9', // React doesn't support IE8 anyway
                    //                 ],
                    //             }),
                    //         ],
                    //     },
                    // },
                ],
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
                // Exclude `js` files to keep "css" loader working as it injects
                // its runtime that would otherwise processed through "file" loader.
                // Also exclude `html` and `json` extensions so they get processed
                // by webpacks internal loaders.
                exclude: [/\.(js|jsx|css|scss|mjs)$/, /\.html$/, /\.json$/],
                loader: require.resolve('file-loader'),
                options: {
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },
        ],
    },

    plugins,

    devtool: 'source-map',

    devServer: {
        proxy: {
            '/api': {
                target: process.env.UNLEASH_API || 'http://localhost:4242',
                changeOrigin: true,
                secure: false,
            },
        },
        port: process.env.PORT || 3000,
    },
};
