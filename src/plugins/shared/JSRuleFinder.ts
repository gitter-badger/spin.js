import { Builder } from '../../Builder';

export default class JSRuleFinder {
  public rule: any;

  constructor(builder: Builder) {
    const jsCandidates = [String(/\.js$/), String(/\.jsx?$/), String(/\.ts$/), String(/\.tsx?$/)];
    for (const rule of builder.config.module.rules) {
      if (jsCandidates.indexOf(String(rule.test)) >= 0) {
        this.rule = rule;
        break;
      }
    }
    if (!this.rule) {
      this.rule = { test: /\.js$/ };
      builder.config.module.rules = builder.config.module.rules.concat(this.rule);
    }
  }

  get extensions(): string[] {
    const testStr = String(this.rule.test);
    if (testStr.indexOf('jsx') >= 0) {
      return ['jsx', 'js'];
    } else if (testStr.indexOf('js') >= 0) {
      return ['js'];
    } else if (testStr.indexOf('tsx') >= 0) {
      return ['tsx', 'ts', 'jsx', 'js'];
    } else if (testStr.indexOf('ts') >= 0) {
      return ['ts', 'js'];
    }
  }
}
