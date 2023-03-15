import { fsExtra, glob, logger, prompts } from '@umijs/utils';
import getGitRepoInfo from 'git-repo-info';
import path from 'path';
import { readPackage } from 'read-pkg';
import 'zx/globals';

import { PATHS } from './.internal/constants';
import { assert } from './utils';

(async () => {
  const { branch } = getGitRepoInfo();
  logger.info(`branch: ${branch}`);

  // 检查是否有未提交的代码
  logger.event('check git status');
  const isGitClean = (await $`git status --porcelain`).stdout.trim().length;
  assert(!isGitClean, 'git status is not clean');

  // 检查是否有未拉取的远端代码
  logger.event('check git remote update');
  await $`git fetch`;
  const gitStatus = (await $`git status --short --branch`).stdout.trim();
  assert(!gitStatus.includes('behind'), `git status is behind remote`);

  const materialPaths = glob.sync(`${PATHS.PACKAGES}/*`);
  const materialPkgMap: Record<string, { pkg: any; path: string }> = {};
  const choicesPkgs = [{ title: 'components', value: 'components' }];

  for (let i = 0; i < materialPaths.length; i++) {
    const info = await readPackage({ cwd: materialPaths[i] });

    materialPkgMap[`${info.name}`] = {
      pkg: info,
      path: materialPaths[i]
    };
    choicesPkgs.push({
      title: info.name,
      value: info.name
    });
  }

  // 选择需要发布的包
  const { releasePkg } = await prompts([
    {
      type: 'select',
      name: 'releasePkg',
      message: 'release pkg',
      choices: choicesPkgs
    }
  ]);

  const lernaConfig = JSON.parse(
    (await fsExtra.readFile(path.join(__dirname, 'lerna.json'), 'utf-8')).toString()
  );

  if ('components' === releasePkg) {
    lernaConfig['packages'] = [`${releasePkg}/*`];
  } else {
    const materialInfo = materialPkgMap[releasePkg];

    if (!materialInfo) return;

    // lernaConfig['version'] = materialInfo.pkg.version;
    lernaConfig['packages'] = [`packages${materialInfo.path.replace(PATHS.PACKAGES, '')}`];
  }

  await fsExtra.writeFile(path.join(__dirname, '../lerna.json'), JSON.stringify(lernaConfig));

  // 检查是否无更新
  logger.event('check package changed');
  let changed;
  try {
    changed = (await $`lerna changed --loglevel error`).stdout.trim();
    assert(!!changed, `no package is changed`);
  } catch (error) {
    assert(!!changed, `no package is changed`);
  }

  // 编译
  logger.event('build packages');
  if ('components' === releasePkg) {
    await $`pnpm -r --filter './components/**' run build`;
  } else {
    await $`pnpm -r --filter ${releasePkg} run build`;
  }

  // 修改包版本
  logger.event('changed package version');
  await $`lerna version --exact --conventional-graduate`;

  // 发布版本
  logger.event('publish');
  await $`lerna publish from-package`;
})();
