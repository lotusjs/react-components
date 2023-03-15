import { logger } from '@umijs/utils';
import getGitRepoInfo from 'git-repo-info';
import 'zx/globals';
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
  await $`pnpm run build`;

  // 修改包版本
  logger.event('changed package version');
  await $`lerna version --exact --conventional-graduate`;

  // 发布版本
  logger.event('publish');
  await $`lerna publish from-package`;
})();
