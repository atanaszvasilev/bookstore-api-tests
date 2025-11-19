# Bookstore API Tests

Automated API tests for the [Fake REST API](https://fakerestapi.azurewebsites.net/) Bookstore endpoints. This project uses **TypeScript**, **Jest**, and **Axios** for testing, with Docker support for running tests in isolated environments.

---

## Table of Contents

- [Project Structure](#project-structure)  
- [Environment Setup](#environment-setup)  
- [Installation](#installation)  
- [Running Tests](#running-tests)  
- [Docker](#docker)  
- [Logging](#logging)  
- [API Modules](#api-modules)  
- [Testing Practices](#testing-practices)  

---

## Project Structure

```sh
bookstore-api-tests/
│
├─ .env.stage # Stage environment variables
├─ .env.prod # Production environment variables
├─ package.json
├─ Dockerfile
├─ jest.config.ts
├─ jest.setup.ts
│
├─ src/
│ ├─ api/
│ │ ├─ books/ # Books API
│ │ │ ├─ index.ts
│ │ │ └─ books.api.ts
│ │ └─ authors.api.ts # Authors API
│ │
│ ├─ config/
│ │ ├─ http.client.ts
│ │ └─ env.ts
│ │
│ ├─ types/
│ │ ├─ book.ts
│ │ └─ author.ts
│ │
│ └─ utils/
│ ├─ logger.ts
│ └─ fs.utils.ts
│
└─ tests/
├─ books.spec.ts
└─ authors.spec.ts
```

---

## Environment Setup

Environment variables are separated per environment:

- `.env.stage`
- `.env.prod`

Example `.env.stage`:

```sh
BASE_URL=https://fakerestapi.azurewebsites.net/api/v1
TIMEOUT=10000
```

The `loadEnv()` utility loads the correct environment based on the `ENV` variable.

---

## Installation

1. Clone the repository:

```sh
git clone <repo-url>
cd bookstore-api-tests
```

2. Install dependencies:
```sh
npm install
```

---

## Running Tests

#### Locally
Run tests for a specific environment:
```sh
npm run test:stage   # Stage
npm run test:prod    # Production
```

#### Docker
Docker allows running tests in an isolated environment with the correct environment variables:
```sh
npm run docker:test:stage
npm run docker:test:prod
```

##### Commands in package.json:
```sh
"scripts": {
  "test:stage": "cross-env ENV=stage jest --config jest.config.ts",
  "test:prod": "cross-env ENV=prod jest --config jest.config.ts",
  "docker:build": "docker build -t bookstore-api-tests .",
  "docker:test:stage": "docker run --rm -e ENV=stage bookstore-api-tests npm test",
  "docker:test:prod": "docker run --rm -e ENV=prod bookstore-api-tests npm test"
}
```

##### Logging
- Uses winston for logging.
- All requests and responses are logged to logs/app.log.

##### API Modules
- `src/api/books/` – CRUD operations for Books.
- `src/api/authors.api.ts` – CRUD operations for Authors, including fetching authors by book ID.

All API calls use a shared `httpClient` with interceptors for request/response logging.

##### Testing Practices
- Tests are written using <b>Jest</b> and <b>TypeScript</b>.

- `beforeAll` and `afterAll` hooks are used to create and clean up test data.
- `Partial<T>` and `Omit<T, 'id'>` are used for payloads.
- All tests validate API responses against the expected object structure.
- Non-existing entities are tested for proper `404` responses.