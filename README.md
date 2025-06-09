# Events Platform

Access the live application here: https://launchpadeventsplatform.netlify.app/login

## Summary

This is a full-stack web application where users can browse, sign up for, and manage events. Staff users can also create and manage events.  Both user types can add events to their google calenders once signed up/ if they are the creator of an event. The platform includes authentication, protected routes, accessibility features, and responsive design.


Built with:

- Frontend: React, React Router, CSS Modules
- Backend: Node.js, Express, PostgreSQL 
- Hosting: Netlify (Frontend), Render (Backend), Neondb (Database)

---

## Test Accounts

Use the following test accounts to try out the platform:

### Staff account
- Email: staff@email.com
- Password: staffstaff123

### Community member account
- Email: john@email.com
- Password: johnjohn123

---

## Running the Project Locally

### Prerequisites

- Node.js (v18 or later recommended)
- PostgreSQL
- npm 

---

### 1. Clone the repository and Install dependencies

#### Frontend

```bash
cd FE
npm install
```

#### Backend 
(package.json for the backend exists in the project root directory)

```bash
cd ..
npm install
```

---

### 3. Set up environment variables

Create 3 `.env` files in the root of the `BE` directory with the following names and evironment variables:

  1. .env.development 
    PGDATABASE=events_platform

  2. .env.secrets 
    JWT_SECRET=[any random string]
    JWT_EXPIRES_IN=1h

  3. .env.test
    PGDATABASE=events_platform_test

---

### 4. Set up and seed the database

Make sure PostgreSQL is running. From the project root run:

```bash
npm run setup-dbs
npm run seed
```

---

### 5. Run the application

#### Start the backend

```bash
cd BE
node listen.js
```

#### Start the frontend (in a new terminal)

```bash
cd FE
npm run dev
```
Open the link in the terminal to view the app in the browser.

---

### 6. Testing
You may wish to run the tests for the server using: 

```bash
npm run test
```




