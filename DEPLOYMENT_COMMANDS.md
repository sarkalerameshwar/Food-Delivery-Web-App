# Deployment Build and Run Commands

This document provides the commands to build and run the Food Delivery Website project for production deployment.

## Backend

1. Navigate to the backend directory:
```
cd backend
```

2. Install dependencies (if not already installed):
```
npm install
```

3. Set up environment variables in a `.env` file in the backend directory with the following keys:
```
MONGODB_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Start the backend server in production mode:
```
npm start
```

## Frontend

1. Navigate to the frontend directory:
```
cd frontend
```

2. Install dependencies (if not already installed):
```
npm install
```

3. Build the frontend React app for production:
```
npm run build
```

The production build will be created in the `dist` folder.

## Admin

1. Navigate to the admin directory:
```
cd admin
```

2. Install dependencies (if not already installed):
```
npm install
```

3. Build the admin React app for production:
```
npm run build
```

The production build will be created in the `dist` folder.

## Notes

- The backend server is configured to serve the frontend build at `/app/*` routes and the admin build at `/admin/*` routes.
- Ensure the backend server is running to serve the static files and API endpoints.
- Make sure environment variables are correctly set before starting the backend server.
