import { logger } from '@umijs/utils';

export function assert(v: unknown, message: string) {
  if (!v) {
    logger.error(message);
    process.exit(1);
  }
}
