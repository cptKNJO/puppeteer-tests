# Puppeteer Tests

End-to-end tests using Puppeteer. Puppeteer APIs tested so far documented in [apis-tested.md](apis-tested.md).

## Run tests
Run with `--runInBand --detectOpenHandles` to find leaks.
```
yarn test
```

## Debug tests
Debugs tests without headless mode.
```
yarn test:debug
```
