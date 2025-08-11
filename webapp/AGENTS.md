# Repository Guidelines

## Project Structure & Module Organization
- `src/`: Application code.
  - `components/`: Reusable UI (e.g., `Sidebar.js`, `CasesList.js`).
  - `pages/`: Route views (e.g., `HomePage.js`, `CaseDetails.js`).
  - `data/`: Local mock data and helpers (e.g., `sampleCases.js`).
  - Tests live alongside code (e.g., `App.test.js`).
- `public/`: Static assets served at root.
- `package.json`: Scripts and deps; CRA-based setup (`react-scripts`).

## Build, Test, and Development Commands
- `npm start`: Start dev server at `http://localhost:3000` with hot reload.
- `npm test`: Run Jest in watch mode (React Testing Library).
- `npm run build`: Production build to `build/`.
- Optional: `CI=true npm test -- --watch=false` for non-interactive test runs.

## Coding Style & Naming Conventions
- Indentation: 2 spaces; semicolons optional but be consistent.
- React: Components in PascalCase (`CasesList`), hooks/callbacks in camelCase.
- File layout: `src/components/ComponentName.js`, `src/pages/PageName.js`, `src/data/*.js`.
- Styling: Material UI (MUI) theme + `styled-components`; global CSS in `App.css`/`index.css`.
- Linting: CRA ESLint config (`react-app`, `react-app/jest`) runs during `npm start/build`.

## Testing Guidelines
- Frameworks: Jest + React Testing Library + `@testing-library/jest-dom`.
- Test files: `*.test.js` near source (e.g., `src/App.test.js`).
- Write tests for UI behavior (roles, labels), not implementation details.
- Coverage: `npm test -- --coverage` (optional); target critical paths and components.

## Commit & Pull Request Guidelines
- Commits: Use Conventional Commits for clarity (e.g., `feat: add case details route`, `fix: correct VRN filter`).
- Branches: `feature/<short-name>` or `fix/<short-name>`.
- PRs: Include description, linked issue, test notes, and screenshots/GIFs for UI changes. Ensure `npm test` and `npm run build` pass locally.

## Security & Configuration
- Do not commit secrets; prefer `.env.local` for machine-specific variables (CRA reads `REACT_APP_*`).
- Avoid `npm run eject` unless absolutely necessary.
- Run `npm audit` periodically and update vulnerable dependencies as needed.
