[![CI](https://github.com/whitelv/ci_cd/actions/workflows/main.yml/badge.svg)](https://github.com/whitelv/ci_cd/actions/workflows/main.yml)

# UniDone

UniDone is a small Vite-based to-do application with CI checks for linting and unit tests.

## Scripts

- `npm install` installs dependencies
- `npm run dev` starts the local development server
- `npm run build` builds the production bundle
- `npm run lint` runs ESLint
- `npm run test:unit` runs unit tests with Node.js test runner

## CI

GitHub Actions runs the pipeline on every push to `main` and `develop`, and on each `pull_request`.
