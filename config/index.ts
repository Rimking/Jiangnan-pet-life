import { defineConfig, type UserConfigExport } from '@tarojs/cli';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack';
import devConfig from './dev';
import prodConfig from './prod';

const path = require('path');
// https://taro-docs.jd.com/docs/next/config#defineconfig-杈呭姪鍑芥暟
export default defineConfig(async (merge) => {
  const baseConfig: UserConfigExport = {
    projectName: 'myTaroApp',
    date: '2025-6-3',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: ['@tarojs/plugin-html'],
    defineConstants: {},
    env: {
      API_ENV: `"${process.env.API_ENV}"`,
    },
    copy: {
      patterns: [],
      options: {},
    },
    framework: 'react',
    compiler: {
      type: 'webpack5',
      prebundle: {
        enable: false,
        force: true,
      },
    },
    cache: {
      enable: false, // Webpack 鎸佷箙鍖栫紦瀛橀厤缃紝寤鸿寮€鍚€傞粯璁ら厤缃鍙傝€冿細https://docs.taro.zone/docs/config-detail#cache
    },
    mini: {
      miniCssExtractPluginOption: {
        ignoreOrder: true, // 蹇界暐 CSS 椤哄簭璀﹀憡
      },
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        url: {
          enable: true,
          config: {
            limit: 1024, // 璁惧畾杞崲灏哄涓婇檺
          },
        },
        cssModules: {
          enable: true, // 榛樿涓?false锛屽闇€浣跨敤 css modules 鍔熻兘锛屽垯璁句负 true
          config: {
            namingPattern: 'module', // 杞崲妯″紡锛屽彇鍊间负 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
        autoprefixer: {
          enable: true,
          config: {
            // autoprefixer 閰嶇疆椤?
            overrideBrowserslist: ['Android >= 6', 'ios >= 10'],
          },
        },
      },
      compile: {
        // exclude:['src/operationalSubpage/static/ec-canvas/'],
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);
        chain.merge({
          plugin: {
            install: {
              plugin: UnifiedWebpackPluginV5,
              args: [
                {
                  appType: 'taro',
                  rem2rpx: {
                    rootValue: 16,
                    propList: ['*'],
                    transformUnit: 'rpx',
                  },
                },
              ],
            },
          },
        });
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js',
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css',
      },
      esnextModules: ['@antmjs/vantui'],
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 榛樿涓?false锛屽闇€浣跨敤 css modules 鍔熻兘锛屽垯璁句负 true
          config: {
            namingPattern: 'module', // 杞崲妯″紡锛屽彇鍊间负 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);
      },
    },

    alias: {
      '@/components': path.resolve(__dirname, '..', 'src/components'),
      '@/utils': path.resolve(__dirname, '..', 'src/utils'),
      '@/assets': path.resolve(__dirname, '..', 'src/assets'),
      '@/constants': path.resolve(__dirname, '..', 'src/constants'),
      '@/http': path.resolve(__dirname, '..', 'src/http'),
      '@/styles': path.resolve(__dirname, '..', 'src/styles'),
      '@/config': path.resolve(__dirname, '..', 'src/config'),
      '@/api': path.resolve(__dirname, '..', 'src/api'),
      '@/enum': path.resolve(__dirname, '..', 'src/enum'),
    },
    rn: {
      postcss: {
        cssModules: {
          enable: false, // 榛樿涓?false锛屽闇€浣跨敤 css modules 鍔熻兘锛屽垯璁句负 true
        },
      },
    },
  };
  if (process.env.NODE_ENV === 'development') {
    // 鏈湴寮€鍙戞瀯寤洪厤缃紙涓嶆贩娣嗗帇缂╋級
    return merge({}, baseConfig, devConfig);
  }
  // 鐢熶骇鏋勫缓閰嶇疆锛堥粯璁ゅ紑鍚帇缂╂贩娣嗙瓑锛?
  return merge({}, baseConfig, prodConfig);
});

