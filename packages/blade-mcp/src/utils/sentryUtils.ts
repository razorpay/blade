import * as Sentry from '@sentry/node';
import { getPackageJSONVersion } from './generalUtils.js';

const initSentry = (): void => {
  Sentry.init({
    dsn: process.env.BLADE_MCP_SENTRY_DSN,
    environment: process.env.NODE_ENV ?? 'development',
    release: getPackageJSONVersion(),
    sendDefaultPii: false,
  });
};

const captureException = (error: unknown): void => {
  Sentry.captureException(error);
};

export { initSentry, captureException };
