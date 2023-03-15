import { rimrafSync } from 'rimraf';

import { PATHS } from './.internal/constants';

(async () => {
  rimrafSync('**/node_modules', {
    glob: {
      cwd: PATHS.ROOT
    }
  });
})();
