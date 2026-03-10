## ShaadiBio – Marriage Biodata Generator

Full-stack SaaS-style web app to create, save, and download marriage biodata PDFs using templates.

### Tech stack

- **Frontend**: React (Vite) + TypeScript + Tailwind CSS + React Router + React Hook Form
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Other**: JWT auth, `bcrypt`, `multer` (image upload), `html2pdf.js` (PDF generation)

---

## Project structure

- `frontend/` – Vite React app
- `backend/` – Express API

---

## Prerequisites

- Node.js 18+ (you have Node 22 installed)
- MongoDB running locally, or a MongoDB Atlas connection string

---

## Backend setup (Express + MongoDB)

From `shaadiBio/backend`:

1) Install dependencies:

```bash
npm install
```

2) Create `.env` using `.env.example`:

```bash
cp .env.example .env
```

3) Update `.env`:

- `MONGO_URI`: your MongoDB connection string
- `JWT_SECRET`: any strong secret string
- `CLIENT_ORIGIN`: `http://localhost:5173` (frontend dev URL)

4) Start the API:

```bash
npm run dev
```

API runs on `http://localhost:5000` and exposes:

- `POST /api/register`
- `POST /api/login`
- `POST /api/biodata` (protected, multipart; supports `profilePhoto`)
- `GET /api/biodata` (protected)
- `PUT /api/biodata/:id` (protected, multipart)
- `DELETE /api/biodata/:id` (protected)

Uploads are served from:

- `GET /uploads/<filename>`

---

## Frontend setup (React + Vite)

From `shaadiBio/frontend`:

1) Install dependencies:

```bash
npm install
```

2) Create `.env` using `.env.example`:

```bash
cp .env.example .env
```

3) Start the frontend:

```bash
npm run dev
```

Open:

- `http://localhost:5173`

---

## Notes

- **PDF download**: uses `html2pdf.js` from the live preview area.
- **Auth**: JWT token is stored in `localStorage` and attached as `Authorization: Bearer <token>` for API calls.

