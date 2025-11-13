# Coffee Shop Hub ☕️  

Full-stack MERN experience for managing a specialty coffee blog, complete with recipe curation, tasting notes, and barista workflows.

## Overview

Coffee Shop Hub demonstrates deep integration across MongoDB, Express.js, React, and Node.js. It exposes a rich REST API, modern React front end, role-based authoring tools, and interactive community features (likes, ratings, comments).

## Features

- **Content Management**
  - CRUD for beverages/posts with rich metadata (categories, tags, pricing, featured images).
  - Optimistic likes, ratings, and featured flags.
- **Community Tools**
  - Commenting with optional 1–5 ratings.
  - Real-time optimistic likes and tastings.
- **Discoverability**
  - Search by keyword, filter by category, paginate results.
  - Hero cards, featured badges, contextual metadata.
- **Advanced Enhancements**
  - Role-aware authoring (admin / barista / customer).
  - Image uploads via local storage (switchable to Cloudinary).
  - Authentication with JWT (cookies + localStorage token sync).
  - Protected routes + profile management.

## Tech Stack

- **Front End**: React 19, React Router 7, Vite, React Hook Form + Yup, TanStack Query, Context API
- **Back End**: Node.js, Express 5, Mongoose 8, JWT, Multer, Cloudinary (optional)
- **Database**: MongoDB
- **Utilities**: express-validator, bcryptjs, morgan, cors, dotenv

## Project Structure

```
mern-stack/
├── client/               # Vite + React front end
│   ├── env.example
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       └── services/
├── server/               # Express + MongoDB back end
│   ├── env.example
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── README.md
└── .gitignore
```

## Prerequisites

- Node.js v18+
- npm 9+
- MongoDB (local instance or Atlas URL)

## Environment Variables

Duplicate the provided examples and adjust for your environment:

```bash
cp server/env.example server/.env
cp client/env.example client/.env
```

### Server `.env`

| Key                    | Description                                |
|------------------------|--------------------------------------------|
| `PORT`                 | API port (default `5000`)                  |
| `MONGODB_URI`          | Mongo connection string                    |
| `JWT_SECRET`           | Secret for signing JWT tokens              |
| `JWT_ACCESS_EXPIRES_IN`| Token lifetime (e.g. `1d`)                 |
| `CLIENT_URL`           | Allowed client origin                      |
| `NODE_ENV`             | `development` or `production`              |
| `CLOUDINARY_*`         | (Optional) Cloudinary credentials          |
| `UPLOAD_PROVIDER`      | `local` or `cloudinary`                    |

### Client `.env`

| Key           | Description                                  |
|---------------|----------------------------------------------|
| `VITE_PORT`   | Dev server port (default `5173`)             |
| `VITE_API_URL`| Points to Express API (default `http://localhost:5000`) |
| `VITE_APP_NAME` | Display name in the UI                     |

## Installation & Setup

```bash
# Clone the repository created by GitHub Classroom
git clone <your-repo-url>
cd mern-stack
```

### Back End

```bash
cd server
npm install
npm run dev   # Runs with nodemon
```

The Express API will start on `http://localhost:5000` by default.

### Front End

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Vite will launch on `http://localhost:5173` (with proxy configured for `/api`).

## Usage Notes

- The **first registered user** is automatically promoted to `admin`.
- Subsequent signups default to the `customer` role.
- Admins/Baristas can create and edit beverages, manage categories, and moderate comments.
- Uploads are stored under `server/uploads`. Switch to Cloudinary by setting `UPLOAD_PROVIDER=cloudinary` and populating Cloudinary credentials.

## API Overview

| Method | Endpoint                         | Description                            | Auth |
|--------|----------------------------------|----------------------------------------|------|
| GET    | `/api/health`                    | Health check                           | Public |
| POST   | `/api/auth/register`             | Register new user                      | Public |
| POST   | `/api/auth/login`                | Login and receive JWT                  | Public |
| POST   | `/api/auth/logout`               | Logout + clear cookie                  | Auth |
| GET    | `/api/auth/me`                   | Current profile                        | Auth |
| PUT    | `/api/auth/me`                   | Update profile                         | Auth |
| GET    | `/api/posts`                     | List posts (supports `q`, `category`, `page`, `limit`, `sort`, `status`) | Public |
| GET    | `/api/posts/:id`                 | Fetch post by ID                       | Public |
| GET    | `/api/posts/slug/:slug`          | Fetch post by slug                     | Public |
| POST   | `/api/posts`                     | Create post (multipart)                | Admin/Barista |
| PUT    | `/api/posts/:id`                 | Update post (multipart)                | Admin/Barista |
| DELETE | `/api/posts/:id`                 | Delete post                            | Admin/Barista |
| POST   | `/api/posts/:id/toggle-like`     | Toggle like                            | Auth |
| GET    | `/api/categories`                | List categories                        | Public |
| POST   | `/api/categories`                | Create category                        | Admin/Barista |
| PUT    | `/api/categories/:id`            | Update category                        | Admin/Barista |
| DELETE | `/api/categories/:id`            | Delete category                        | Admin |
| GET    | `/api/posts/:postId/comments`    | List comments for post                 | Public |
| POST   | `/api/posts/:postId/comments`    | Add comment + rating                   | Auth |
| DELETE | `/api/posts/:postId/comments/:commentId` | Remove comment                 | Owner/Admin |

Validation errors return `422` with field-level details. All responses follow `{ success, data, message }` conventions.

## Testing Ideas

- **API**: Use Thunder Client / Postman against the routes above.
- **Frontend**: Exercise forms (login/register, create/edit post), verify search/pagination, and confirm optimistic likes.
- **Linting**: `npm run lint` (front end).

## Deployment Considerations

- Configure environment variables using production-ready secrets.
- Serve the built client (`npm run build`) via static hosting (Netlify, Vercel) and proxy to the Express API.
- For image hosting, prefer Cloudinary or S3. Toggle by setting `UPLOAD_PROVIDER`.
- Ensure HTTPS and secure cookies for production (`NODE_ENV=production`).



