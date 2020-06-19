# APIs Tested

## class: BrowserContext

1. event: 'targetchanged'
2. event: 'targetcreated'
3. event: 'targetdestroyed'
4. browserContext.browser()
5. browserContext.clearPermissionOverrides() :heavy_check_mark:
6. browserContext.close() :heavy_check_mark:
7. browserContext.isIncognito() :heavy_check_mark:
8. browserContext.newPage() :heavy_check_mark:
9. browserContext.overridePermissions(origin, permissions) :heavy_check_mark:
10. browserContext.pages() :heavy_check_mark:
11. browserContext.targets() :heavy_check_mark:
12. browserContext.waitForTarget(predicate[, options])

## class: Page

1. event: 'close'
2. event: 'console'
3. event: 'dialog'
4. event: 'domcontentloaded'
5. event: 'error'
6. event: 'frameattached'
7. event: 'framedetached'
8. event: 'framenavigated'
9. event: 'load'
10. event: 'metrics'
11. event: 'pageerror'
12. event: 'popup'
13. event: 'request'
14. event: 'requestfailed'
15. event: 'requestfinished'
16. event: 'response'
17. event: 'workercreated'
18. event: 'workerdestroyed'
19. page.$(selector) :heavy_check_mark:
20. page.$$(selector) :heavy_check_mark:
21. page.$$eval(selector, pageFunction[, ...args]) :heavy_check_mark:
22. page.$eval(selector, pageFunction[, ...args]) :heavy_check_mark:
23. page.$x(expression) :heavy_check_mark:
24. page.accessibility
25. page.addScriptTag(options)
26. page.addStyleTag(options)
27. page.authenticate(credentials)
28. page.bringToFront()
29. page.browser()
30. page.browserContext()
31. page.click(selector, options) :heavy_check_mark:
32. page.close(options) :heavy_check_mark:
33. page.content()
34. page.cookies(...urls) :heavy_check_mark:
35. page.coverage
36. page.deleteCookie(...cookies) :heavy_check_mark:
37. page.emulate(options) :heavy_check_mark:
38. page.emulateMedia(type)
39. page.emulateMediaFeatures(features)
40. page.emulateMediaType(type)
41. page.emulateTimezone(timezoneId)
42. page.evaluate(pageFunction[, ...args]) :heavy_check_mark:
43. page.evaluateHandle(pageFunction[, ...args]) :heavy_check_mark:
44. page.evaluateOnNewDocument(pageFunction[, ...args])
45. page.exposeFunction(name, puppeteerFunction) :heavy_check_mark:
46. page.focus(selector) :heavy_check_mark:
47. page.frames()
48. page.goBack(options) :heavy_check_mark:
49. page.goForward(options) :heavy_check_mark:
50. page.goto(url, options) :heavy_check_mark:
51. page.hover(selector)
52. page.isClosed() :heavy_check_mark:
53. page.keyboard
54. page.mainFrame()
55. page.metrics()
56. page.mouse
57. page.pdf(options)
58. page.queryObjects(prototypeHandle)
59. page.reload(options) :heavy_check_mark:
60. page.screenshot(options) :heavy_check_mark:
61. page.select(selector, ...values)
62. page.setBypassCSP(enabled)
63. page.setCacheEnabled(enabled)
64. page.setContent(html, options)
65. page.setCookie(...cookies) :heavy_check_mark:
66. page.setDefaultNavigationTimeout(timeout) :heavy_check_mark:
67. page.setDefaultTimeout(timeout) :heavy_check_mark:
68. page.setExtraHTTPHeaders(headers)
69. page.setGeolocation(options)
70. page.setJavaScriptEnabled(enabled)
71. page.setOfflineMode(enabled)
72. page.setRequestInterception(value)
73. page.setUserAgent(userAgent) :heavy_check_mark:
74. page.setViewport(viewport) :heavy_check_mark:
75. page.tap(selector)
76. page.target()
77. page.title() :heavy_check_mark:
78. page.touchscreen
79. page.tracing
80. page.type(selector, text, options)
81. page.url() :heavy_check_mark:
82. page.viewport() :heavy_check_mark:
83. page.waitFor(selectorOrFunctionOrTimeout[, options[, ...args]]) :heavy_check_mark:
84. page.waitForFileChooser(options)
85. page.waitForFunction(pageFunction, [, options[, ...args]]) :heavy_check_mark:
86. page.waitForNavigation(options) :heavy_check_mark:
87. page.waitForRequest(urlOrPredicate, options)
88. page.waitForResponse(urlOrPredicate, options)
89. page.waitForSelector(selector, options) :heavy_check_mark:
90. page.waitForXPath(xpath, options) :heavy_check_mark:
91. page.workers()

## class: Keyboard
1. keyboard.down(key[, options]) :heavy_check_mark:
2. keyboard.press(key[, options]) :heavy_check_mark:
3. keyboard.sendCharacter(char) :heavy_check_mark:
4. keyboard.type(text[, options]) :heavy_check_mark:
5. keyboard.up(key[, options]) :heavy_check_mark:

## class: Mouse
1. mouse.click(x, y[, options])
2. mouse.down([options])
3. mouse.move(x, y[, options])
4. mouse.up([options])

## class: ElementHandle
1. elementHandle.$(selector)]
2. elementHandle.$$(selector)]
3. elementHandle.$$eval(selector, pageFunction[, ...args])]
4. elementHandle.$eval(selector, pageFunction[, ...args])]
5. elementHandle.$x(expression)]
6. elementHandle.asElement()]
7. elementHandle.boundingBox()]
8. elementHandle.boxModel()]
9. elementHandle.click([options])]
10. elementHandle.contentFrame()]
11. elementHandle.dispose()]
12. elementHandle.evaluate(pageFunction[, ...args])]
13. elementHandle.evaluateHandle(pageFunction[, ...args])]
14. elementHandle.executionContext()]
15. elementHandle.focus()]
16. elementHandle.getProperties()]
17. elementHandle.getProperty(propertyName)] :heavy_check_mark:
18. elementHandle.hover()]
19. elementHandle.isIntersectingViewport()] :heavy_check_mark:
20. elementHandle.jsonValue()] :heavy_check_mark:
21. elementHandle.press(key[, options])]
22. elementHandle.screenshot([options])]
23. elementHandle.select(...values)]
24. elementHandle.tap()] :heavy_check_mark:
25. elementHandle.toString()]
26. elementHandle.type(text[, options])]
27. elementHandle.uploadFile(...filePaths)]
