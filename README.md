## ShaadiBio – Marriage Biodata Generator

Full-stack SaaS-style web app to create, save, and download marriage biodata PDFs using templates.

### Live Deployment

- **Frontend**: [https://shaadi-bio-bay.vercel.app/](https://shaadi-bio-bay.vercel.app/) (Vercel)
- **Backend API**: [https://shaadibio-backend-14fu.onrender.com](https://shaadibio-backend-14fu.onrender.com) (Render)

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
- `CLIENT_ORIGIN`: `http://localhost:5173` (local frontend) or `https://shaadi-bio-git-main-akshats-projects-a071b71d.vercel.app` (production)
- `RAZORPAY_KEY_ID`: Your Razorpay test/live key ID
- `RAZORPAY_KEY_SECRET`: Your Razorpay test/live key secret

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

3) Update `.env`:

For **local development**:
```
VITE_API_ORIGIN=http://localhost:5000
```

For **production** (uses deployed backend):
```
VITE_API_ORIGIN=https://shaadibio-backend-14fu.onrender.com
```

4) Start the frontend:

```bash
npm run dev
```

Open:

- `http://localhost:5173` (local)
- [Live Frontend](https://shaadi-bio-bay.vercel.app/) (production)

---

## Features

✨ **Core Features**:
- Create beautiful marriage biodata in minutes
- Multiple responsive templates (Classic, Modern)
- High-quality PDF download with watermark/password protection
- User authentication with JWT
- Save multiple biodata profiles
- Real-time form data persistence
- Privacy controls (hide phone, email, income)
- Multi-language support (English, Hindi)
- Premium features (no watermark, password-protected PDF)

💳 **Payment Integration**:
- Razorpay integration for premium subscriptions
- Lifetime premium access for ₹499
- Premium user management

---

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password with token

### Biodata Management
- `GET /api/biodata` - Get all user's biodata
- `POST /api/biodata` - Create new biodata (supports multipart file upload)
- `PUT /api/biodata/:id` - Update biodata
- `DELETE /api/biodata/:id` - Delete biodata

### PDF & Subscriptions
- `POST /api/pdf/encrypt` - Encrypt PDF with password
- `POST /api/subscription/create` - Create Razorpay order
- `POST /api/subscription/verify` - Verify payment & upgrade to premium

### File Uploads
- `GET /uploads/<filename>` - Get uploaded profile photos

---

## Troubleshooting

### Frontend won't connect to backend
- Check that `VITE_API_ORIGIN` in `.env` matches your backend URL
- For local development: ensure backend is running on `http://localhost:5000`
- For production: make sure `CLIENT_ORIGIN` in backend `.env` includes frontend URL

### PDF download issues
- Ensure `html2pdf.js` is installed: `npm install html2pdf.js`
- For password protection: verify backend is running (uses muhammara library)

### Payment not working
- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in backend `.env`
- Use Razorpay test mode keys for development
- Check browser console for payment errors

---

## Notes

- **PDF Generation**: Uses `html2pdf.js` with custom watermark functionality
- **Image Quality**: Profile photos are stored at high resolution (canvas scale 5x)
- **Auth Flow**: JWT token stored in `localStorage`, sent as `Authorization: Bearer <token>`
- **Watermarks**: Free/unregistered users see watermarks; premium users don't
- **Form Persistence**: Form data auto-saves to `localStorage` to prevent data loss
- **Languages**: Supports English and Hindi via `i18next`

---

## Future Enhancements

- [ ] Admin dashboard for site analytics
- [ ] More biodata templates
- [ ] Email notifications
- [ ] Social media sharing
- [ ] Print-friendly biodata cards
- [ ] Biodata version history (in progress)

---

**Made with ❤️ for marriage biodata generation**

