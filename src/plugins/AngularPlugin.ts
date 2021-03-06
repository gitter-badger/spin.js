import * as path from 'path';

import { Builder } from '../Builder';
import { ConfigPlugin } from '../ConfigPlugin';
import requireModule from '../requireModule';
import Spin from '../Spin';
import JSRuleFinder from './shared/JSRuleFinder';

export default class AngularPlugin implements ConfigPlugin {
  public configure(builder: Builder, spin: Spin) {
    const stack = builder.stack;

    if (stack.hasAll(['angular', 'webpack'])) {
      const webpack = requireModule('webpack');

      const jsRuleFinder = new JSRuleFinder(builder);
      const jsRule = jsRuleFinder.rule;
      builder.config = spin.merge(builder.config, {
        module: {
          rules: [
            {
              test: jsRule.test,
              use: requireModule.resolve('angular2-template-loader')
            }
          ]
        },
        plugins: [
          // Workaround for angular/angular#11580
          new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            path.resolve('src'),
            {} // a map of your routes
          )
        ]
      });

      if (!stack.hasAny('dll') && stack.hasAny('web')) {
        builder.config = spin.merge(
          {
            entry: {
              index: [require.resolve('./angular/angular-polyfill.js')]
            }
          },
          builder.config
        );
      }
    }
  }
}
