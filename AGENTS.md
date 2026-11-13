# Project Instructions

This repository contains a TypeScript e-commerce application split into `backend/` and `frontend/`. Keep changes scoped to the relevant application and maintain compatibility across their API boundary.

## General
- Read the relevant existing code and conventions before changing files.
- Keep changes focused on the requested task; avoid unrelated refactors.
- Do not commit secrets. Both apps use local `.env` files; preserve them and never print or copy their values into source, logs, or documentation.
- When changing API routes, request/response shapes, or authentication behavior, check whether the other app depends on the same contract.
- Respect nested `AGENTS.md` files, which provide more specific instructions for their directories.

## Backend (`backend/`)
- Node.js, TypeScript, Express 5, PostgreSQL, and Prisma 7.
- Source code is in `backend/src/`; Prisma schema and seed files are in `backend/prisma/`.
- Use the existing Prisma client and project patterns for database access. Review schema and migration implications before changing data models.
- Available scripts: `npm run dev`, `npm run build`, `npm start`, `npm run seed`, and `npm run swagger`.
- The configured `npm test` script is a placeholder and exits with an error; do not treat it as a working test suite.

## Frontend (`frontend/`)
- React 19, TypeScript, Vite, React Router, and Tailwind CSS 4.
- Application source is in `frontend/src/`; public static assets are in `frontend/public/`.
- Follow existing component, routing, styling, and API-call patterns.
- Available scripts: `npm run dev`, `npm run build`, `npm run lint`, and `npm run preview`.

## Verification
- Run only checks relevant to the change and report what was run and any failures.
- Backend TypeScript build: from `backend/`, run `npm run build`.
- Frontend type/build check: from `frontend/`, run `npm run build`.
- Frontend lint: from `frontend/`, run `npm run lint`.
