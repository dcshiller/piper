module.exports = {
    entry: "./lib/piper.js",
    output: {
        path: __dirname,
        filename: "./lib/bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};
