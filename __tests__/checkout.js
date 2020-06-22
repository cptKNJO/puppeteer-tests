const faker = require('faker');
const { destinationPicker } = require('./utility/xpaths');
const { dropDown, planet, checkoutForm } = require('./utility/selectors');
const { baseUrl, timeout } = require('./utility/config');

const fileToUpload = './__tests__/assets/fileToUpload.jpg';
faker.locale = 'en_GB';
const user = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  ssn: '123-12-1234',
  phone: faker.phone.phoneNumberFormat(1),
  userAgent: faker.internet.userAgent(),
};

const pickDate = async (page, date, month) => {
  const dayXPath = `//div//span[contains(text(), ${date.getDate()})]`;
  const monthXPath = `//div/span[contains(text(), ${month})]`;

  await page.waitForXPath(destinationPicker.nextMonth);
  const nextBtnHandle = (await page.$x(destinationPicker.nextMonth))[0];
  await page.evaluate((el) => el.click(), nextBtnHandle);

  await page.waitForXPath(monthXPath);
  const dayHandle = (await page.$x(dayXPath))[0];
  const okBtnHandle = (await page.$x(destinationPicker.okBtn))[0];
  await dayHandle.click();
  await okBtnHandle.click();
};

describe(
  'Checkout',
  () => {
    let page;
    beforeEach(async () => {
      page = await global.__BROWSER__.newPage();
      await page.setViewport({ width: 960, height: 800 });
      await page.goto(baseUrl);
      await page.waitForXPath(destinationPicker.departing);
    }, timeout);

    afterEach(async () => {
      await page.close();
    });

    it('allows correct destination to be selected', async () => {
      // Will be 1 and 7 for returning
      const departingDate = new Date(2020, new Date().getMonth() + 1, 1);
      const month = departingDate.toLocaleString('default', { month: 'short' });

      const departingHandle = (await page.$x(destinationPicker.departing))[0];
      await departingHandle.click();
      await page.waitForSelector('[data-react-toolbox="calendar"]');
      await pickDate(page, departingDate, month);

      const adultHandle = (await page.$x(destinationPicker.adults))[0];
      await adultHandle.click();
      await page.waitForSelector(dropDown.adults, { visible: true });
      await page.$eval(dropDown.adults, (ul) => ul.querySelector('li:nth-child(3)').click()); // 2 adults

      const childrenHandle = (await page.$x(destinationPicker.children))[0];
      await childrenHandle.click();
      await page.waitForSelector(dropDown.children, { visible: true });
      await page.$eval(dropDown.children, (ul) => ul.querySelector('li:nth-child(4)').click()); // 3 children

      const destinationHeadline = await page.$eval('h3', (el) => el.innerText);
      expect(destinationHeadline).toContain(`5 travelers, ${month} 1 – 7`);
    });

    it('allows checkout', async () => {
      const firstPlanet = await page.$(planet);
      await firstPlanet.$eval('button', (btn) => btn.click());

      let payIsDisabled = (await page.$(`${checkoutForm.payNowBtn}[disabled]`)) !== null;
      expect(payIsDisabled).toBeTruthy();

      // Fill input fields
      await page.waitForSelector(checkoutForm.form);
      await page.type(checkoutForm.inputName, user.name);
      await page.type(checkoutForm.inputEmail, user.email);
      await page.type(checkoutForm.inputSSN, user.ssn);
      await page.type(checkoutForm.inputPhone, user.phone);

      let isFileUploaded = (await page.$(`${checkoutForm.dropzone} img`)) !== null;
      expect(isFileUploaded).toBeFalsy();

      // Upload file
      const dropzone = await page.$(
        `${checkoutForm.dropzone} input[type=file]`,
      );
      await dropzone.uploadFile(fileToUpload);
      isFileUploaded = (await page.$(`${checkoutForm.dropzone} img`)) !== null;
      expect(isFileUploaded).toBeTruthy();

      await page.click(checkoutForm.termsCheckbox);
      await page.waitForFunction(
        (selector) => !document.querySelector(selector).disabled,
        { polling: 100 },
        checkoutForm.payNowBtn,
      );

      payIsDisabled = (await page.$(`${checkoutForm.payNowBtn}[disabled]`)) !== null;
      expect(payIsDisabled).toBeFalsy();
    });

    it('allows file upload using fileChooser', async () => {
      const firstPlanet = await page.$(planet);
      await firstPlanet.$eval('button', (btn) => btn.click());

      await page.waitForSelector(checkoutForm.form);

      let isFileUploaded = (await page.$(`${checkoutForm.dropzone} img`)) !== null;
      expect(isFileUploaded).toBeFalsy();

      // Upload file
      let [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click(checkoutForm.dropzone),
      ]);
      const isMultiple = await fileChooser.isMultiple();
      expect(isMultiple).toBeTruthy();

      await fileChooser.cancel();
      isFileUploaded = (await page.$(`${checkoutForm.dropzone} img`)) !== null;
      expect(isFileUploaded).toBeFalsy();

      [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click(checkoutForm.dropzone),
      ]);
      await fileChooser.accept([fileToUpload]);

      isFileUploaded = (await page.$(`${checkoutForm.dropzone} img`)) !== null;
      expect(isFileUploaded).toBeTruthy();
    });
  },
  timeout,
);
