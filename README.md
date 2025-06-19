# Vidyarthi

Vidyarthi is a full-stack MERN application to manage and track competitive programming progress of students, integrating with Codeforces API. Features include real-time student CRUD operations, contest and problem-solving analytics, automatic data syncing via cron jobs, inactivity detection with email reminders, and interactive visualizations like graphs and heatmaps. Designed with responsiveness, dark/light mode toggle, and clean UI/UX. Built as part of the Full Stack Developer assignment for TLE Eliminators.

## Project Structure

```
.
├── .gitignore
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── config/
│   │    ├── db.js
│   │    └── models/
│   │           └── Student.js
│   └── routes/
│   │      ├── exportRoutes.js
│   │      ├── leaderboardRoutes.js
│   │      └── studentRoutes.js
│   └── utils/
│       └── InactivityEmail.js
└── frontend/
│   ├── .gitignore
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── globals.css
│   │   └── students/
│   ├── public/
│   ├── eslint.config.mjs
│   ├── next.config.mjs
│   ├── package.json
│   ├── package-lock.json
│   └── postcss.config.mjs
└── README.md

``` 
---


## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Backend Setup

1. Navigate to the `backend` directory:
    ```sh
    cd backend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Copy `.env.sample` to `.env` and configure environment variables.
4. Start the backend server:
    ```sh
    npm start
    ```

### Frontend Setup

1. Navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Copy `.env.sample` to `.env` and configure environment variables.
4. Start the development server:
    ```sh
    npm run dev
    ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- **Backend**
  - `npm start` — Start the backend server
- **Frontend**
  - `npm run dev` — Start the Next.js development server
  - `npm run build` — Build the frontend for production
  - `npm start` — Start the production frontend server

---