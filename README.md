# HRnet — WealthHealth

Employee management application built with React, replacing the original jQuery version. OpenClassrooms project P12.

## Stack

- React 19 + Vite 8
- react-router-dom v7
- Redux Toolkit + redux-persist
- react-datepicker v9
- react-select v5
- hrnet-datatable (linked locally via Vite alias)
- Playwright (end-to-end tests)

## Getting started

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint with ESLint |
| `npx playwright test` | Run end-to-end tests |
| `npx playwright test --ui` | Run E2E tests with the Playwright UI |

## Routes

| Path | Page |
|---|---|
| `/` | Redirects to `/create` |
| `/create` | Create a new employee |
| `/employees` | Employee list |

Both pages are lazy-loaded with React Suspense.

## Features

**Create employee (`/create`)**
Form with fields for first name, last name, date of birth, start date, department, and address (street, city, state, zip code). State and department use searchable dropdowns (react-select). Date fields use react-datepicker with manual entry support.

Validation rules:
- Date of birth is required and the employee must be at least 18 years old.
- Start date is required and must not be before the employee's 18th birthday.

On success, a confirmation modal appears and the employee is saved to the Redux store.

**Employee list (`/employees`)**
Table of all employees powered by the `hrnet-datatable` package. Supports global search, multi-column sort, and pagination.

## Project structure

src/
components/
common/ Modal
layout/ Header, Footer, Layout
features/
employees/ constants.js (states, departments), validateEmployee.js
pages/ CreateEmployee.jsx, EmployeeList.jsx
store/ employeesSlice.js, index.js (store + persistor)
App.jsx
main.jsx
e2e/
hrnet.spec.js Playwright tests (navigation, form, validation, list)


## Data persistence

Employee data is stored in `localStorage` under the key `persist:hrnet` via redux-persist. Clearing site data in the browser resets the application to an empty list.

## Local package link

The `hrnet-datatable` package is not installed from npm — it is resolved locally via a Vite alias pointing to `../hrnet-datatable/src/index.js`. Both projects must live in the same parent directory.