import { CracoConfig, WebpackContext } from "@craco/types";
import webpack from "webpack";
import path from "path";

const config: CracoConfig = {
  webpack: {
    alias: {},

    configure: (webpackConfig: any, { env, paths }: WebpackContext) => {
      webpackConfig.resolve.fallback = {
        buffer: require.resolve("buffer/"),
        util: require.resolve("util/"),
        stream: require.resolve("stream-browserify"),
        path: require.resolve("path-browserify"),
        os: require.resolve("os-browserify/browser"),
        crypto: require.resolve("crypto-browserify"),
        process: require.resolve("process/browser"),
        vm: require.resolve("vm-browserify"),
      };

      if (!webpackConfig.plugins) {
        webpackConfig.plugins = [];
      }

      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: "process/browser",
        })
      );

      return webpackConfig;
    },
  },
};

export default config;
