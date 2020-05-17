# Installation

`npm install`

# Running tests

`npm run test`

# Setting required parameters

```bash
export APP=<path/url to app.apk>
export PLATFORM_VERSION=<android version>
export DEVICE=<android device name>
npm run test
```

# Generating Allure report

```bash
npm install -g allure-commandline --save-dev
npm run report
allure open
```