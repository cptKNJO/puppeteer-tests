const {
  logo, heroText, planet, loadMoreBtn,
} = require('./utility/selectors');
const { backToTop } = require('./utility/xpaths');
const { baseUrl, timeout } = require('./utility/config');

describe(
  'Home page',
  () => {
    let page;
    beforeAll(async () => {
      page = await global.__BROWSER__.newPage();
      await page.setViewport({ width: 960, height: 800 });
      await page.setDefaultTimeout(timeout);
    }, timeout);

    beforeEach(async () => {
      await page.goto(baseUrl);
    }, timeout);

    afterAll(async () => {
      await page.close();
    });

    it('space advisor logo visible', async () => {
      const text = await page.$eval(logo, (h1) => h1.textContent);
      expect(text).toMatch('Space Advisor');
    });

    it('hero headline and title match', async () => {
      const hero = await page.$eval(heroText, (h1) => h1.textContent);
      expect(hero).toMatch('Space & Beyond');

      const title = await page.title();
      expect(title).toMatch(hero);
    });

    it('shows 6 planets initially', async () => {
      await page.waitForSelector(planet);
      const planets = await page.$$(planet);
      expect(planets).toHaveLength(6);
    });

    it('loads more planets when button clicked', async () => {
      await page.waitForSelector(planet);
      let planets = await page.$$(planet);
      expect(planets).toHaveLength(6);

      await page.waitForSelector(loadMoreBtn);
      await page.focus(loadMoreBtn);
      await page.keyboard.press('Enter');

      planets = await page.$$(planet);
      expect(planets).toHaveLength(9);
    });

    it('disables load more button once clicked', async () => {
      await page.waitForSelector(loadMoreBtn);
      const loadBtn = await page.$(loadMoreBtn);
      let propertyHandle = await loadBtn.getProperty('disabled');
      let disabled = await propertyHandle.jsonValue();
      expect(disabled).toBeFalsy();

      await page.hover(loadMoreBtn);
      await page.mouse.down();
      await page.mouse.up();
      propertyHandle = await loadBtn.getProperty('disabled');
      disabled = await propertyHandle.jsonValue();
      expect(disabled).toBeTruthy();
    });

    it('has functioning back to top button', async () => {
      await page.waitForXPath(backToTop);
      const buttonHandle = (await page.$x(backToTop))[0];
      const text = await buttonHandle.evaluate((btn) => btn.innerText);
      expect(text).toBe('Back to top');

      const start = await page.screenshot({
        encoding: 'base64',
      });

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      const bottom = await page.screenshot({
        encoding: 'base64',
      });
      expect(start).not.toBe(bottom);

      await buttonHandle.click();
      const bodyHandle = await page.evaluateHandle(() => document.body);
      const pageHeight = await page.evaluate(
        (el) => el.scrollHeight,
        bodyHandle,
      );
      await page.waitForFunction(`${pageHeight} > 1900`);

      const end = await page.screenshot({
        encoding: 'base64',
      });
      expect(start).toEqual(end);
    });
  },
  timeout,
);
