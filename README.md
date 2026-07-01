# SauceDemo Playwright Test Suite

Automated Positive, Negative & End-to-End coverage for [saucedemo.com](https://www.saucedemo.com) using **Playwright (JavaScript)** with a **Page Object Model** architecture.

---

## Quick Start

```bash
npm ci
npx playwright install --with-deps chromium firefox
npx playwright test            # headless, all browsers
npx playwright test --headed   # watch tests run live
npx playwright show-report     # open last HTML report
```

---

## Project Structure

```
saucedemo-playwright/
├── pages/                   Page Object classes
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── ProductDetailPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js      (Step1 + Step2 + Complete)
├── utils/
│   ├── BasePage.js          Shared menu / cart helpers
│   ├── helper.js            loginAsStandardUser()
│   └── constants.js         URLs + expected messages
├── test-data/
│   └── users.json           Valid users (×5) + negative users
├── tests/
│   ├── login/               Positive (data-driven ×5) + Negative
│   ├── header/              Title, menu open/close via aria-hidden
│   ├── footer/              Copyright text, social link isolation
│   ├── products/            Heading, card count, 4 sort variants, add/remove
│   ├── productDetail/       Price & desc match, back button, cart nav
│   ├── cart/                Qty=1, count ±1, Continue Shopping, Checkout
│   ├── checkout/            Step1 (4 validation negatives), Step2 totals, Complete
│   ├── logout/              Logout + About navigation
│   ├── security/            5 protected routes while logged out
│   ├── reset/               6 Reset App State scenarios
│   └── e2e/                 3 full end-to-end flows
├── playwright.config.js
├── package.json
└── .github/workflows/playwright.yml
```

---

## Framework Choice

### Why Playwright?
- **Auto-waiting** — every action and assertion retries automatically; zero manual `waitFor` boilerplate needed for stable elements.
- **Unified runner** — `@playwright/test` bundles test runner, assertion library, fixtures, reporters, and browser management in one install. No Mocha + Chai wiring.
- **True multi-browser** — Chromium and Firefox run in parallel via `playwright.config.js` projects with a single browser installation command.
- **CI-ready artifacts** — traces, screenshots, and video are captured on failure automatically and uploaded as GitHub Actions artifacts for offline debugging.
- **Context isolation** — each test gets a fresh browser context by default; no shared state without explicit setup.

### Why Page Object Model?
- Locators live in one class. A selector change means editing one file, not every spec.
- Tests read as business actions (`inventory.addProductToCartByName(...)`) not raw CSS, making failures easier to diagnose.
- New modules = import existing POMs + write assertions. Scales linearly.

### Why Data-Driven Login?
- saucedemo ships five distinct user personas. A `for…of` loop over `users.json` creates a separate test entry per user so per-user failures are individually visible in the report rather than a single aggregated pass/fail.

---

## Extension Plan

### Parallelisation
| Level | How |
|---|---|
| Intra-machine | `fullyParallel: true` already active. Tune `workers: N` in config. |
| CI sharding | `--shard=1/4` across matrix jobs; merge reports with `npx playwright merge-reports`. |
| Cross-browser | Add `webkit` project; run each browser as a separate Actions matrix entry. |

### Reporting
- **Now** — built-in Playwright HTML report uploaded as a GitHub Actions artifact on every run (even failures). Download and open `index.html` for step-level detail, screenshots, and traces.
- **Next — Allure** — `allure-playwright` reporter adds history trends and flaky-test detection. Add `reporter: [['allure-playwright']]` and run `allure generate` in CI.
- **GitHub Pages** — pipe the HTML report to `gh-pages` branch via `peaceiris/actions-gh-pages`; every run produces a public URL visible directly from the Actions summary.
- **Slack / email** — add a `notify` step conditioned on `if: failure()` using `slackapi/slack-github-action` for instant team alerts.
