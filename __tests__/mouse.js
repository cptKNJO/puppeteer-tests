const {
  slider, logo, loadMoreBtn, planet,
} = require('./utility/selectors');
const { baseUrl, timeout } = require('./utility/config');

describe(
  'Slider',
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

    it('has height and width greater than 0', async () => {
      const knobHandle = await page.$(slider.knob);
      const { width, height } = await knobHandle.boundingBox();
      expect(width).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);
    });

    it('has x and y greater than 0', async () => {
      const knobHandle = await page.$(slider.knob);
      const { x, y } = await knobHandle.boundingBox();
      expect(x).toBeGreaterThan(0);
      expect(y).toBeGreaterThan(0);
    });

    it('is set to max initially', async () => {
      const sliderBar = await page.$(slider.bar);
      const { x: xBar, width: widthBar } = await sliderBar.boundingBox();
      const knobHandle = await page.$(slider.knob);
      const { x: xKnob, width: widthKnob } = await knobHandle.boundingBox();
      expect(xKnob).toBe(xBar + widthBar - widthKnob / 2);
    });

    it('can be dragged to lowest value', async () => {
      const sliderBar = await page.$(slider.bar);
      const {
        x: xBar,
        y: yBar,
      } = await sliderBar.boundingBox();

      const knobHandle = await page.$(slider.knob);
      const {
        x: initialXKnob,
        y: yKnob,
        width: widthKnob,
        height: heightKnob,
      } = await knobHandle.boundingBox();

      await page.mouse.move(initialXKnob + widthKnob / 2, yKnob + heightKnob / 2);
      await page.mouse.down();
      await page.mouse.move(xBar, yBar, { steps: 100 });
      await page.mouse.up();

      const {
        x: finalXKnob,
      } = await knobHandle.boundingBox();
      expect(finalXKnob).toBeLessThan(xBar - widthKnob / 2);
    });

    it('can be dragged to random value', async () => {
      const sliderBar = await page.$(slider.bar);
      const {
        x: xBar,
        y: yBar,
      } = await sliderBar.boundingBox();

      const knobHandle = await page.$(slider.knob);
      const {
        x: initialXKnob,
        y: yKnob,
        width: widthKnob,
        height: heightKnob,
      } = await knobHandle.boundingBox();

      const xRandom = Math.random() * 240 + xBar + 1;
      await page.mouse.move(initialXKnob + widthKnob / 2, yKnob + heightKnob / 2);
      await page.mouse.down();
      await page.mouse.move(xRandom, yBar, { steps: 100 });
      await page.mouse.up();

      const {
        x: finalXKnob,
      } = await knobHandle.boundingBox();
      expect(finalXKnob).toBeLessThan(xRandom - widthKnob / 2);
    });
  },
  timeout,
);

describe(
  'Mouse buttons',
  () => {
    let page;
    const mouseButton = ['left', 'middle', 'right'];
    let clickedButton;
    beforeAll(async () => {
      page = await global.__BROWSER__.newPage();
      await page.setViewport({ width: 960, height: 800 });
    }, timeout);

    beforeEach(async () => {
      await page.goto(baseUrl);
      await page.waitFor(logo);
    }, timeout);

    afterEach(async () => {
      await page.removeAllListeners('dialog');
    }, timeout);

    afterAll(async () => {
      await page.close();
    });

    it('registers right click', async () => {
      await page.evaluate(() => {
        document.body.addEventListener('mousedown', (event) => {
          window.alert(event.which); // eslint-disable-line
        });
      });
      page.on('dialog', async (dialog) => {
        clickedButton = mouseButton[Number(dialog.message()) - 1];
        await dialog.dismiss();
      });

      await page.mouse.click(0, 0, {
        button: 'right',
      });

      expect(clickedButton).toBe('right');
    });

    it('does not load more planets on right click', async () => {
      await page.waitForSelector(planet);
      let planets = await page.$$(planet);
      expect(planets).toHaveLength(6);

      await page.click(loadMoreBtn, {
        button: 'right',
      });

      planets = await page.$$(planet);
      expect(planets).not.toHaveLength(9);
    });

    it('registers middle click', async () => {
      await page.evaluate(() => {
        document.body.addEventListener('mousedown', (event) => {
          window.alert(event.which); // eslint-disable-line
        });
      });
      page.on('dialog', async (dialog) => {
        clickedButton = mouseButton[Number(dialog.message()) - 1];
        await dialog.dismiss();
      });

      await page.mouse.click(0, 0, {
        button: 'middle',
      });

      expect(clickedButton).toBe('middle');
    });

    it('does not load more planets on middle click', async () => {
      await page.waitForSelector(planet);
      let planets = await page.$$(planet);
      expect(planets).toHaveLength(6);

      await page.click(loadMoreBtn, {
        button: 'middle',
      });

      planets = await page.$$(planet);
      expect(planets).not.toHaveLength(9);
    });
  },
  timeout,
);
