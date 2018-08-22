// OK to use console.* in this file only.
//
// tslint:disable:no-console

/**
 * Logs message(s) that only will appear in development.
 *
 * @param args
 */
// tslint:disable-next-line:no-any
export function logDebug(...args: any[]) {
  if (!FLAGS_PRODUCTION) {
    console.log(...args);
  }
}
