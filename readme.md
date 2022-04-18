# Preface

The following application has been implemented in TypeScript as part of a dev quiz for the company SCHWABEO. The app provides a `GET` API endpoint under `/evaluation` which accepts the URLs of `CSV` files by specifing a `url` parameter. An example call would be:

```
http://localhost:3005/evaluation/?url=http://localhost:3005/csv/ps-1.csv&url=http://localhost:3005/csv/ps-2.csv
```

The CSV files are parsed and then evaluated. During the evaluation three questions are being answered:

1. Which politician gave the most speeches in 2013?
2. Which politician gave the most speeches on the topic 'Internal Security'?
3. Which politician used the fewest words (in total)?

The answers are provided in `JSON`.

# Installation

Install all dependencies by running the command `npm install`.

# Configuration

Under the hood the app uses `dotenv` to load environment variables via an `.env` file. Rename `.env.example` to `.env` to make the app load the provided env variables. The default server port is `3005`.

# Development

To run the dev version of the app use the command `npm run dev`. The server will automatically restart once code changes are detected.

# Production

You can build and then run the app with the command `npm run start`. If you only want to build the production version use `npm run build`.

# Tests

Run the integration and unit tests with `npm run test`. The API endpoint `/evaluation` is tested via an integration test, the functions in `evaluation.js` are tested by using unit tests. All test files can be found in the `/__tests__` directory.
