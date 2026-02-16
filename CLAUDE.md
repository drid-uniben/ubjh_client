# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## High-level Code Architecture and Structure

This project is a Next.js application utilizing the App Router. The codebase follows a component-based architecture:
-   **`src/app`**: Contains the Next.js App Router structure, defining routes and pages. This is where your routes and server components will primarily reside.
-   **`src/components`**: Houses reusable UI components used throughout the application.
-   **`src/services`**: Contains logic for interacting with external APIs or other services, typically using Axios.
-   **Styling**: Primarily uses Tailwind CSS for styling, along with utility libraries like `tailwind-merge`, `clsx`, and `class-variance-authority`.
-   **UI Libraries**: Leverages Radix UI for accessible and customizable UI primitives.

## Commonly Used Commands

-   **Install Dependencies**: If `node_modules` is not present, run `npm install`.
-   **Run Development Server**: `npm run dev`
    -   Starts the Next.js development server with Turbopack for fast refresh and compilation.
    -   Accessible at `http://localhost:3000`.
-   **Build for Production**: `npm run build`
    -   Builds the application for production deployment.
-   **Start Production Server**: `npm run start`
    -   Starts the Next.js server with the production build.
-   **Lint Code**: `npm run lint`
    -   Runs ESLint to identify and report on patterns found in TypeScript code.

**Note on Testing**: There are no explicit test commands defined in the `package.json` scripts. If testing is required, a testing framework like Jest or React Testing Library would typically be configured, and commands such as `npm test` or `npm run test:watch` would be available. Running a single test would depend on the specific testing framework's CLI options.
