import { createConfig, type Config } from '@umijs/test';

const defaultConfig = createConfig({
  target: 'browser'
});

const config: Config.InitialOptions = {
  ...defaultConfig,
  setupFilesAfterEnv: [
    ...(defaultConfig.setupFilesAfterEnv || []),
    './tests/setupFilesAfterEnv.ts'
  ],
  moduleNameMapper: {
    '@lotus-design/utils': '<rootDir>/packages/utils/src/index.ts'
  }
};

export default config;
