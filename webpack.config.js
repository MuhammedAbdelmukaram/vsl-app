const webpack = require("webpack");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const fs = require("fs");

module.exports = (env) => {
    console.log("Received environment variables:", env);

    const buildId = env.BUILD_ID || "default";
    console.log("Building with BUILD_ID:", buildId);

    const videoConfigPath = path.resolve(process.cwd(), `temp/${buildId}/video.config.json`);
    console.log("Video config path:", videoConfigPath);

    // ✅ Read the video config file
    const videoConfig = fs.existsSync(videoConfigPath) ? require(videoConfigPath) : {};

    // ✅ Ensure `_id` is available
    if (!videoConfig._id) {
        console.error("❌ Missing `_id` in video config!");
    }

    console.log("Loaded video configuration:", videoConfig);

    const outputPath = path.resolve(process.cwd(), `dist/${buildId}`);
    console.log("Output path:", outputPath);

    return {
        entry: "./src/player.js",
        output: {
            filename: "player.bundle.js",
            chunkFilename: "[name].bundle.js",
            path: outputPath,
        },
        target: "web",
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-react"],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
            ],
        },
        optimization: {
            splitChunks: false,
            runtimeChunk: false,
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                }),
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                VIDEO_CONFIG: JSON.stringify(videoConfig), // ✅ Ensures the bundled `player.js` has access to VIDEO_CONFIG
            }),
        ],
        resolve: {
            extensions: [".js", ".jsx"],
        },
        externals: {},
        mode: "production",
    };
};
