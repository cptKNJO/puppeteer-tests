const faker = require('faker');
const { baseUrl, timeout } = require('./utility/config');

const user = {
  userAgent: faker.internet.userAgent(),
  address: {
    latitude: Number(faker.address.latitude()),
    longitude: Number(faker.address.longitude()),
  },
};

describe(
  'User agent, page content, timezone',
  () => {
    let page;
    beforeAll(async () => {
      page = await global.__BROWSER__.newPage();
      await page.setViewport({ width: 960, height: 800 });
      await page.setUserAgent(user.userAgent);
      await page.setDefaultTimeout(timeout);
      await page.emulateTimezone('GB');
    }, timeout);

    beforeEach(async () => {
      await page.goto(baseUrl);
    }, timeout);

    afterAll(async () => {
      await page.close();
    });

    it('has the correct user agent', async () => {
      await page.exposeFunction('getLength', (userAgent) => userAgent.length);
      const pageUALength = await page.evaluate(async () => window.getLength(navigator.userAgent));
      expect(pageUALength).toBe(user.userAgent.length);

      await page.exposeFunction(
        'matchesUA',
        (pageUA, userUA) => pageUA === userUA,
      );
      const isSame = await page.evaluate(
        async (userUA) => window.matchesUA(navigator.userAgent, userUA),
        user.userAgent,
      );
      expect(isSame).toBeTruthy();
    });

    it('lets user agent change', async () => {
      const initialUA = await page.evaluate(() => window.navigator.userAgent);

      await page.setUserAgent(faker.internet.userAgent());
      const finalUA = await page.evaluate(() => window.navigator.userAgent);

      expect(initialUA).not.toBe(finalUA);
    });

    it('sets page content', async () => {
      const initialContent = await page.content();
      await page.setContent('<h1>Testing</h1>');
      const finalContent = await page.content();
      expect(initialContent).not.toBe(finalContent);
    });

    it('does not let page content be empty', async () => {
      await page.setContent('');
      const content = await page.content();
      expect(content).not.toBe('');
    });

    it('allows timezone to be changed', async () => {
      const initialTz = await page.evaluate(
        () => Intl.DateTimeFormat().resolvedOptions().timeZone,
      );
      await page.emulateTimezone('UTC');
      const finalTz = await page.evaluate(
        () => Intl.DateTimeFormat().resolvedOptions().timeZone,
      );
      expect(initialTz).not.toBe(finalTz);
    });
  },
  timeout,
);

describe(
  'Cookies',
  () => {
    let page;
    beforeAll(async () => {
      page = await global.__BROWSER__.newPage();
      await page.setViewport({ width: 960, height: 800 });
    }, timeout);

    beforeEach(async () => {
      await page.goto(baseUrl);
    }, timeout);

    afterAll(async () => {
      await page.close();
    });

    it('allows cookies to be set', async () => {
      const cookie = { name: 'test', value: '23' };
      const initialCookies = await page.cookies();
      await page.setCookie(cookie);
      const finalCookies = await page.cookies();
      expect(initialCookies).not.toEqual(finalCookies);
    });

    it('allows cookies to be deleted', async () => {
      const cookie = { name: 'test', value: '23' };
      await page.setCookie(cookie);
      const initialCookies = await page.cookies();
      expect(initialCookies).toMatchObject([cookie]);

      await page.deleteCookie(cookie);
      const finalCookies = await page.cookies();
      expect(finalCookies).not.toMatchObject(cookie);
    });

    it('prevents secure cookies from being retrieved', async () => {
      const secureCookie = { name: 'secure', value: '00', secure: true };
      const unsecureCookie = { name: 'unsecure', value: '11' };
      await page.setCookie(secureCookie, unsecureCookie);
      const initialCookies = await page.cookies();
      expect(initialCookies).toMatchObject([unsecureCookie]);

      await page.deleteCookie(unsecureCookie);
      const finalCookies = await page.cookies();
      expect(finalCookies).toEqual([]);
    });
  },
  timeout,
);

describe(
  'Permissions',
  () => {
    let page;
    let context;
    beforeAll(async () => {
      context = global.__BROWSER__.defaultBrowserContext();
      page = await context.newPage();
    }, timeout);

    beforeEach(async () => {
      await page.goto(baseUrl);
    }, timeout);

    afterAll(async () => {
      await page.close();
    });

    it('allows access to location', async () => {
      const notGranted = await page.evaluate(
        async () => (await navigator.permissions.query({ name: 'geolocation' })).state,
      );
      expect(notGranted).not.toBe('granted');

      context.clearPermissionOverrides();
      await context.overridePermissions(baseUrl, ['geolocation']);

      const granted = await page.evaluate(
        async () => (await navigator.permissions.query({ name: 'geolocation' })).state,
      );
      expect(granted).toBe('granted');
    });

    it('allows access to camera', async () => {
      const notGranted = await page.evaluate(
        async () => (await navigator.permissions.query({ name: 'camera' })).state,
      );
      expect(notGranted).not.toBe('granted');

      context.clearPermissionOverrides();
      await context.overridePermissions(baseUrl, ['camera']);

      const granted = await page.evaluate(
        async () => (await navigator.permissions.query({ name: 'camera' })).state,
      );
      expect(granted).toBe('granted');
    });

    it('can run in incognito mode', async () => {
      expect(context.isIncognito()).toBeFalsy();
      try {
        await context.close();
      } catch (error) {
        expect(error.message).toMatch('Non-incognito profiles cannot be closed!');
      }

      const incognitoContext = await global.__BROWSER__.createIncognitoBrowserContext();

      expect(incognitoContext.isIncognito()).toBeTruthy();
      await incognitoContext.close();
    });

    it('multiple pages in incognito mode', async () => {
      const incognitoContext = await global.__BROWSER__.createIncognitoBrowserContext();
      let pages = await incognitoContext.pages();
      let targets = await incognitoContext.targets();
      expect(pages).toHaveLength(0);
      expect(targets).toHaveLength(0);

      const firstPage = await incognitoContext.newPage();
      const secondPage = await incognitoContext.newPage();
      await Promise.all([
        firstPage.goto(baseUrl),
        secondPage.goto(`${baseUrl}/login`),
      ]);

      pages = await incognitoContext.pages();
      targets = await incognitoContext.targets();
      expect(pages).toHaveLength(2);
      expect(targets).toHaveLength(2);

      expect(targets[0].type()).toBe('page');
      expect(targets[0].url()).toBe(firstPage.url());

      expect(targets[1].type()).toBe('page');
      expect(targets[1].url()).toBe(secondPage.url());
    });
  },
  timeout,
);
