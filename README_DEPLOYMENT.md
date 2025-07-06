# Food Delivery Website - Deployment Guide

This document provides instructions to deploy the Food Delivery Website project, including frontend and backend setup.

---

## Backend Deployment

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)
- Stripe account and API keys
- Environment variables configured

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Install Dependencies

```bash
cd backend
npm install
```

### Start Server

For production:

```bash
node server.js
```

For development with auto-reload:

```bash
npm run dev
```

---

## Frontend Deployment

### Prerequisites

- Node.js (v18+ recommended)

### Install Dependencies

```bash
cd frontend
npm install
```

### Build for Production

```bash
npm run build
```

This will create a `dist` folder with the production build.

### Serve the Build

You can serve the build folder using any static server or configure your backend to serve it.

---

## Backend Serving Frontend

The backend can be configured to serve the frontend build by:

- Copying the `dist` folder from frontend to backend directory or referencing it.
- Adding static serving middleware in `server.js` (if not already done):

```js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'path_to_frontend_dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'path_to_frontend_dist', 'index.html'));
});
```

---

## Additional Notes

- Ensure CORS settings are properly configured for production.
- Secure environment variables and secrets.
- Use HTTPS in production.
- Monitor logs and errors.

---

## Summary

1. Setup environment variables.
2. Install dependencies in both frontend and backend.
3. Build frontend for production.
4. Start backend server.
5. Optionally configure backend to serve frontend build.

---

For any issues, please refer to the project documentation or contact the maintainer.
