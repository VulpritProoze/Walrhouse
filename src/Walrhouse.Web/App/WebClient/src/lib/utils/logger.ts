/**
 * Simple logging utility.
 *
 * Based on user request: This utility is configured to ONLY log
 * when the application is running in DEVELOPMENT mode.
 *
 * @remarks
 * If you intended to log ONLY in PRODUCTION, change the `isEnv` check
 * to use `import.meta.env.PROD`.
 */

const isEnv = import.meta.env.DEV;

export const logger = {
  /**
   * Logs an error to the console only in dev.
   */
  error: (...args: unknown[]) => {
    if (isEnv) {
      console.error('[DEV-ERROR]', ...args);
    }
  },

  /**
   * Logs a warning to the console only in dev.
   */
  warn: (...args: unknown[]) => {
    if (isEnv) {
      console.warn('[DEV-WARN]', ...args);
    }
  },

  /**
   * Logs info to the console only in dev.
   */
  info: (...args: unknown[]) => {
    if (isEnv) {
      console.info('[DEV-INFO]', ...args);
    }
  },
};
