# 🚀 React App Setup (CSC-308 Quick Reference)

## Part I: Initial Setup

-   **Monorepo**: Create root folder (`csc-308-app`), run `git init`,
    add `package.json` with `"workspaces": ["packages/*"]`.\

-   **Frontend**: Scaffold React app inside `packages/react-frontend`
    using `npm create vite@latest react-frontend`.\

-   **Run locally**:

    ``` bash
    cd packages/react-frontend
    npm install
    npm run dev
    ```

    Opens app at `http://localhost:5173/`.

## Part II: React Components + State

-   **Components**: Split UI into files like `MyApp.jsx`, `Table.jsx`,
    `Form.jsx`.\
-   **Props**: Pass read-only data *down* from parent (`MyApp`) to child
    components (`Table`, `Form`).\
-   **State (useState)**: Store and update data (like `characters`)
    inside parent component (`MyApp`).\
-   **Events**: Add `removeOneCharacter` (delete row) and `updateList`
    (add row from form).

## package.json Scripts

Defined in `"scripts"` section --- **only run when you type
`npm run <name>`**.

-   **`npm run dev`** → starts Vite's dev server for live coding (fast
    reload, no `dist/`).\
-   **`npm run build`** → compiles/optimizes app into static files in
    `dist/`.\
-   **`npm run preview`** → serves the `dist/` build on localhost
    (simulate deployment).\
-   **Root forwarding**: In Part II, root `package.json` forwards these
    commands to the `react-frontend` workspace, so grader can run them
    at repo root.

## Workflow Summary

-   While coding → `npm run dev`\
-   Before submitting/deploying → `npm run build` → `npm run preview`\
-   Git: Commit/push your repo root (`csc-308-app`) with `src/` files,
    not `node_modules/`.

⚡ **Analogy**:\
- **Dev** = writing & editing live.\
- **Build** = export to PDF.\
- **Preview** = open the PDF before sending.
