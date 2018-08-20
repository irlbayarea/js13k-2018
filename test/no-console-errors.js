const path = require('path');
const puppeteer = require('puppeteer');

// Used instead of __dirname.
const root = require('app-root-path') + '';

(async () => {
  const browser = await puppeteer.launch();
  console.log(`Launched: ${await browser.version()}`);

  const page = await browser.newPage();
  let caughtError;
  page.on('pageerror', err => {
    console.warn('Unhandled exception', err, err.stack);
    caughtError = err;
  });
  await page.goto(`file:${path.join(root, 'dist', 'index.html')}`);
  await page.waitFor(3000);
  await browser.close();

  if (caughtError) {
    console.error('There were 1 or more unhandled exceptions loading the app!');
    process.exit(1);
  } else {
    console.info('Success');
  }
})();
