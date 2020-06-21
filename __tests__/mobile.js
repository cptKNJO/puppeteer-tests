const { devices } = require('puppeteer');
const {
  planet, loadMoreBtn, login,
} = require('./utility/selectors');
const { loginBtn } = require('./utility/xpaths');
const { baseUrl, timeout } = require('./utility/config');

describe(
  'Mobile view',
  () => {
    let page;
    beforeEach(async () => {
      page = await global.__BROWSER__.newPage();
      await page.setDefaultNavigationTimeout(timeout);
    }, timeout);

    afterEach(async () => {
      await page.close();
    });

    it('is in mobile view', async () => {
      await page.emulate(devices['iPhone 6']);
      await page.goto(baseUrl);
      expect(page.viewport().isMobile).toBeTruthy();
      expect(page.viewport().hasTouch).toBeTruthy();
    });

    it('changes viewport size based on device', async () => {
      await page.emulate(devices['iPhone 6']);
      const newPage = await global.__BROWSER__.newPage();
      await newPage.emulate(devices['Pixel 2']);

      await Promise.all([
        page.goto(baseUrl),
        newPage.goto(baseUrl),
        page.waitForNavigation(),
        newPage.waitForNavigation(),
      ]);

      expect(page.viewport()).not.toEqual(newPage.viewport());
    });

    it('taps on login', async () => {
      await page.emulate(devices['iPhone 6']);
      await page.goto(baseUrl);
      expect(page.url()).toBe(`${baseUrl}/`);

      await page.waitForXPath(loginBtn);
      const buttonHandle = (await page.$x(loginBtn))[0];
      await buttonHandle.tap();
      await page.waitForSelector(login.card);

      expect(page.url()).not.toBe(`${baseUrl}/`);
    });

    it('taps on load more button', async () => {
      await page.emulate(devices['iPhone 6']);
      await page.goto(baseUrl);

      await page.waitForSelector(planet);
      let planets = await page.$$(planet);
      expect(planets).toHaveLength(6);

      await page.waitForSelector(loadMoreBtn);
      const buttonHandle = await page.$(loadMoreBtn);
      await buttonHandle.tap();

      planets = await page.$$(planet);
      expect(planets).toHaveLength(9);
    });
  },
  timeout,
);
