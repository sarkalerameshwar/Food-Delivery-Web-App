# Build and Start Commands for Frontend and Admin on Render

This document provides the commands to build and start the frontend and admin React apps separately for deployment on Render or similar platforms.

## Frontend

### Build
```bash
cd frontend
npm install
npm run build
```

### Start
Render typically serves static sites directly from the build output. You can configure Render to serve the `dist` folder as a static site.

If you want to serve it with a Node.js server, you can use a static server like `serve`:

```bash
npm install -g serve
serve -s dist
```

## Admin

### Build
```bash
cd admin
npm install
npm run build
```

### Start
Similar to frontend, serve the `dist` folder as a static site on Render.

Using `serve`:

```bash
npm install -g serve
serve -s dist
```

## Notes

- For static site hosting on Render, you can configure the build command as `npm run build` and the publish directory as `dist`.
- No backend server is needed to serve these static builds if hosted separately.
- Ensure API endpoints are accessible and CORS is configured properly if backend is hosted separately.
