const { logo } = require('./utility/selectors');
const { baseUrl, timeout } = require('./utility/config');

describe(
  'Scripts and styles',
  () => {
    let page;
    beforeEach(async () => {
      page = await global.__BROWSER__.newPage();
      await page.setViewport({ width: 960, height: 800 });
    }, timeout);

    afterEach(async () => {
      await page.removeAllListeners('request');
    }, timeout);

    afterAll(async () => {
      await page.close();
    });

    it('can intercept scripts', async () => {
      await page.setRequestInterception(true);

      page.on('request', (request) => {
        if (request.resourceType() === 'script') {
          request.abort();
        } else {
          request.continue();
        }
      });
      await page.goto(baseUrl);
      const element = await page.$(logo);
      expect(element).toBeNull();
    });

    it('can intercept scripts', async () => {
      await page.goto(baseUrl);
      const initialState = await page.screenshot({
        encoding: 'base64',
      });
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        if (request.resourceType() === 'stylesheet') {
          request.abort();
        } else {
          request.continue();
        }
      });
      await page.goto(baseUrl);
      const finalState = await page.screenshot({
        encoding: 'base64',
      });

      expect(initialState).not.toMatch(finalState);
    });
  },
  timeout,
);
