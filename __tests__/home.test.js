const timeout = 30000;

describe(
  'Home page',
  () => {
    let page;
    beforeAll(async () => {
      page = await global.__BROWSER__.newPage();
      await page.goto('http://demo.testim.io/');
    }, timeout);

    afterAll(async () => {
      await page.close();
    });

    it('space advisor logo visible', async () => {
      const text = await page.$eval('h1', (h1) => h1.textContent);
      expect(text).toMatch('Space Advisor');
    });

    it('hero headline space & beyond visible', async () => {
      const heroText = await page.$eval('[class^=Hero__headline]', (h1) => h1.textContent);
      expect(heroText).toMatch('Space & Beyond');
    });
  },
  timeout,
);
