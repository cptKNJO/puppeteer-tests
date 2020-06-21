const faker = require('faker');
const { login, profileBtn } = require('./utility/selectors');
const { loginBtn, logoutBtn } = require('./utility/xpaths');
const { baseUrl, timeout } = require('./utility/config');

const user = {
  username: faker.internet.userName(),
  password: faker.internet.password(),
};

describe(
  'Log in',
  () => {
    let page;
    beforeAll(async () => {
      page = await global.__BROWSER__.newPage();
      await page.setViewport({ width: 960, height: 800 });
      page.setDefaultNavigationTimeout(timeout);
    }, timeout);

    beforeEach(async () => {
      await page.goto(baseUrl);
    }, timeout);

    afterAll(async () => {
      await page.close();
    });

    it('shows login text at the top', async () => {
      await page.waitForFunction('window.pageYOffset === 0');
      await page.waitForXPath(loginBtn);
      const buttonHandle = (await page.$x(loginBtn))[0];
      const text = await buttonHandle.evaluate((btn) => btn.innerText);
      expect(text).toBe('LOG IN');
    });

    it('log in button takes user to log in screen', async () => {
      await page.waitForXPath(loginBtn);
      const buttonHandle = (await page.$x(loginBtn))[0];
      await buttonHandle.click();

      await page.waitForNavigation();
      await page.waitFor(login.card);

      const loginSection = await page.evaluateHandle(
        (el) => document.querySelector(el),
        login.card,
      );
      const text = await loginSection.evaluate(
        (el) => el.querySelector('h2').textContent,
      );
      expect(text).toBe('Login');
    });

    it('takes user to login screen from login url', async () => {
      await page.close();
      expect(await page.isClosed()).toBeTruthy();

      page = await global.__BROWSER__.newPage();
      await page.goto(`${baseUrl}/login`);
      await page.waitFor(login.card);

      const loginSection = await page.$(login.card);
      const text = await loginSection.evaluate(
        (el) => el.querySelector('h2').textContent,
      );
      expect(text).toBe('Login');
    });

    it('tabs on login button first', async () => {
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      const loginSection = await page.$(login.card);
      const text = await loginSection.evaluate(
        (el) => el.querySelector('h2').textContent,
      );
      expect(text).toBe('Login');
    });

    it('has the same title on page change', async () => {
      // Click login button
      await page.keyboard.down('Tab');
      await page.keyboard.up('Tab');
      await page.keyboard.down('Enter');
      await page.keyboard.up('Enter');

      const loginTitle = await page.title();
      await page.goBack();
      const homeTitle = await page.title();
      expect(loginTitle).toEqual(homeTitle);

      await page.goForward();
      expect(await page.title()).toEqual(homeTitle);
    });

    it('cancelling login works', async () => {
      await page.goto(`${baseUrl}/login`);
      const loginSection = await page.$(login.card);
      expect(await loginSection.isIntersectingViewport()).toBeTruthy();

      await page.focus(login.cancelBtn);
      await page.keyboard.press('Enter');

      expect(await loginSection.isIntersectingViewport()).toBeFalsy();
    });

    it('clears input when navigating between form submission', async () => {
      await page.waitForXPath(loginBtn);
      const buttonHandle = (await page.$x(loginBtn))[0];
      await buttonHandle.click();

      await page.focus(login.usernameInput);
      await page.keyboard.sendCharacter('a');
      await page.keyboard.sendCharacter('9');

      let usernameInput = await page.$(login.usernameInput);
      let property = await usernameInput.getProperty('value');
      let value = await property.jsonValue();
      expect(value).toEqual('a9');

      await page.goBack();
      await page.goForward();

      usernameInput = await page.$(login.usernameInput);
      property = await usernameInput.getProperty('value');
      value = await property.jsonValue();
      expect(value).toEqual('');
    });

    it('clears input field username when page is refreshed', async () => {
      await page.goto(`${baseUrl}/login`);
      let usernameInput = await page.$(login.usernameInput);
      await usernameInput.type(user.username, { delay: 50 });
      let property = await usernameInput.getProperty('value');
      let value = await property.jsonValue();
      expect(value).toEqual(user.username);

      await page.reload();
      usernameInput = await page.$(login.usernameInput);
      property = await usernameInput.getProperty('value');
      value = await property.jsonValue();
      expect(value).toEqual('');
    });

    it('clears input field password when page is refreshed', async () => {
      await page.goto(`${baseUrl}/login`);
      let passwordInput = await page.$(login.passwordInput);
      await passwordInput.type(user.password, { delay: 50 });
      let property = await passwordInput.getProperty('value');
      let value = await property.jsonValue();
      expect(value).toEqual(user.password);

      await page.reload();
      passwordInput = await page.$(login.passwordInput);
      property = await passwordInput.getProperty('value');
      value = await property.jsonValue();
      expect(value).toEqual('');
    });

    it('clears input if closed', async () => {
      await page.goto(`${baseUrl}/login`);
      let usernameInput = await page.$(login.usernameInput);
      await usernameInput.type(user.username, { delay: 50 });
      let property = await usernameInput.getProperty('value');
      let value = await property.jsonValue();
      expect(value).toEqual(user.username);

      await page.close();
      expect(await page.isClosed()).toBeTruthy();

      page = await global.__BROWSER__.newPage();
      await page.goto(`${baseUrl}/login`);

      usernameInput = await page.$(login.usernameInput);
      property = await usernameInput.getProperty('value');
      value = await property.jsonValue();
      expect(value).toEqual('');
    });

    it('logs out properly', async () => {
      await page.goto(`${baseUrl}/login`);
      const usernameInput = await page.$(login.usernameInput);
      await usernameInput.type(user.username, { delay: 50 });

      const passwordInput = await page.$(login.passwordInput);
      await passwordInput.type(user.password, { delay: 50 });

      await page.click(login.submitBtn);

      await page.waitForSelector(profileBtn);
      await page.click(profileBtn);
      await page.waitForXPath(logoutBtn);
      const linkHandle = (await page.$x(logoutBtn))[0];
      await linkHandle.click();

      await page.waitFor(loginBtn);
    });
  },
  timeout,
);
