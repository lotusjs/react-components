import { defineConfig } from 'dumi';
import { readdirSync } from 'fs';
import { join } from 'path';
import { chalk } from '@umijs/utils';

const isProd = process.env.NODE_ENV === 'production';

const prodConfig = isProd
  ? defineConfig({
      ssr: {}
    })
  : defineConfig({});

const headPkgList: string[] = [];
const pkgList = readdirSync(join(__dirname, 'packages')).filter(
  (pkg) => pkg.charAt(0) !== '.' && !headPkgList.includes(pkg)
);

const alias = pkgList.reduce<Record<string, string>>((pre, pkg) => {
  pre[`@lotus-design/${pkg}`] = join(__dirname, 'packages', pkg, 'src');
  return {
    ...pre
  };
}, {});

console.log(`🌼 alias list \n${chalk.blue(Object.keys(alias).join('\n'))}`);

export default defineConfig({
  hash: true,
  outputPath: '_site',
  themeConfig: {
    logo: '/logo.png',
    name: 'Lotus',
    socialLinks: {
      github: 'https://github.com/lotus-fe/react-components'
    },
    nav: [{ title: '组件', link: '/components' }]
  },
  alias,
  favicons: ['/logo.png'],
  resolve: {
    docDirs: ['docs'],
    atomDirs: pkgList.map((pkg) => {
      return {
        type: 'component',
        dir: `packages/${pkg}/docs`
      };
    })
  },
  ...prodConfig
});
