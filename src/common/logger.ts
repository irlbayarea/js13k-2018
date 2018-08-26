// OK to use console.* in this file only.
//
// tslint:disable:no-console

/**
 * Logs message(s) that only will appear in development.
 *
 * @param args
 */
// tslint:disable-next-line:no-any
export function logDebug(...args: any[]): void {
  if (!FLAGS_PRODUCTION) {
    console.log(...args);
  }
}

/**
 * Logs a timing event that will only appear in development.
 *
 * @param name
 * @param callback
 */
export function logTiming(name: string, callback: () => void): void {
  if (FLAGS_PRODUCTION) {
    callback();
    return;
  }
  console.time(name);
  callback();
  console.timeEnd(name);
}
