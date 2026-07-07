# Todo Application

This repository contains a full-stack Todo application featuring a .NET 10 backend with SQLite and a React (Vite) frontend. With this application, a user can create an account, login, and create a personal set of Todo items. The Todo items are presented in a sortable table and are editable and removable. Overdue tasks are flagged in the UI, and completed tasks are showable/hideable.

# Setup Instructions

Follow the instructions below after cloning the repo to configure and run the application in your local development environment.

## Prerequisites

Ensure you have the following installed on your machine before proceeding:

- .NET 10 SDK

  - Visit the official download page: https://dotnet.microsoft.com/en-us/download/dotnet/10.0
  - Select your OS and run the installer
  - Verify installation: `dotnet --version`

- Node.js

  - Visit the official download page: https://nodejs.org/en
  - Download the LTS version
  - Verify installation of both tools: `node -v` and `npm -v`

- Entity Framework Core CLI Tools

  - Install globally via: `dotnet tool install --global dotnet-ef`

## Backend Setup (.NET 10)

The backend API is built with ASP.NET Core and uses Entity Framework Core with a SQLite database.

1. Install Dependencies
   Restore the NuGet packages for the solution. Open a terminal and navigate to the root directory of the project. From the root directory, run: `dotnet restore`

2. Configure JWT Secrets
   For security, the application uses .NET User Secrets to store the JWT signing key during development rather than hardcoding it in the repository.

   Navigate to the Web project to set your key:
   `cd backend/TodoApp.Web`

   Set your development JWT key:
   `dotnet user-secrets set "Jwt:Key" "ThisIsMySuperSecretKeyForDevelopmentMakeItLong123!!"`

3. Database Migrations
   The application requires an initial SQLite database setup.

   Return to the repository root to execute the Entity Framework migrations:
   `cd ../../`

   Apply the migration to create the SQLite database:
   `dotnet ef database update --project backend/TodoApp.Infrastructure --startup-project backend/TodoApp.Web`

## Frontend Setup (React + Vite)

The frontend is a React application powered by Vite, utilizing Shadcn/UI and TanStack Query.

1. Install Dependencies
   Navigate to the frontend directory:
   `cd frontend`

   Install the required packages:
   `npm install`

2. Environment Configuration
   Create a .env file **in the root of the frontend/ directory** to configure the API connection string:
   `VITE_API_URL=http://localhost:5185/api`
   Save the file.

## Running the Application

You will need two terminal windows open to run the full stack simultaneously.

- Terminal 1: Start the backend API from the repository root: `dotnet run --project backend/TodoApp.Web/TodoApp.Web.csproj`

- Terminal 2: Start the frontend client from the frontend directory: `npm run dev`

Now, you can create an account, login with your new credentials, and start tracking your things to do!

**Note:** The API will typically run on `http://localhost:5185`, and the Vite frontend will be available at `http://localhost:5173`. Check your terminal output for the exact local ports, and return to step 2 of the Frontend Setup section if your actual backend port differs from the one provided there.

# Testing

This application supports dedicated testing suites for both the frontend and backend projects.

- Testing the backend:

  - From the root directory, navigate to the Tests project: `cd backend/TodoApp.Tests`
  - Execute the backend test suite: `dotnet test`

- Testing the frontend:

  - From the root directory, navigate to the frontend directory: `cd frontend`
  - Execute the test suite: `npm run test`

# Future Enhancements

There are several things that I left out of this application in the interest of avoiding over-engineering for an MVP. Here are some things that are not included in this version of the application, but would be added in subsequent iterations:

- **Server-side pagination:** Right now, the data is simple and the initial use cases are small. For scalability, I would implement pagination + either manual paging in the UI or infinite scroll. This initiative would also include:

  - Database-level filtering via URL query parameters to enable search/filter
  - Moving the table sort logic from the browser (TanStack Table) to the server

- **Auth enhancements:** The current state of auth is simple, using JWT, refresh tokens, and a renewal cycle. To expand upon the auth feature, here are some things I would consider:

  - A password recovery feature using time-bound, single-use tokens
  - Password strength and auditing using a library such as `zxcvbn`
  - OAuth 2.0 to allow users to authenticate using established third-party providers

- **User Settings/Account Management:** This would allow the user to make changes to their password, add an avatar or image, delete their account, etc.

- **Soft deletes:** Instead of permanently dropping a record from the database, items would be marked as deleted via a boolean flag. This provides the ability to recover accidentally deleted tasks.

- **Some miscellaneous fun features to consider:**

  - Drag and drop reordering
  - A "Todo categories" feature. The user would be able to assign todos to a specific category, either from a pre-populated list, or a list of categories created by the user
  - Donut/pie charts on the dashboard showing the percentage of todos completed, percentage of todos having high/low/medium priority, etc
  - Ability to upload photos and files to todo items
  - A theme selector and a light mode at minimum
  - Scheduled reminders. A tool such as Hangfire could be utilized for backend processing to send email or push notifications when a todo item is nearing its due date

- **Test suite expansion:** The MVP currently tests the minimum happy/sad paths with unit tests and narrow integration tests. To improve the test suites, I would expand the test coverage to cover most or all testable code, and write end-to-end tests for the frontend.
