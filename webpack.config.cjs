const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, argv) => {
    return {
        mode: argv.mode,
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            clean: true
        },
        devServer: {
            open: true,
            host: 'localhost',
        },
        plugins: [
            ...(env.analyze ? [new BundleAnalyzerPlugin()] : []),
        ],
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/i,
                    loader: 'babel-loader',
                },
                {
                    test: /\.(css|scss)$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ],
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                    type: 'asset',
                },
            ],
        },
    };
};
