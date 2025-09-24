# My Sample JSON DB Posts API Node Project

A minimal Express-based REST API backed by a flat JSON data store. It ships with a curated `data/db.json` sample dataset and is preconfigured with both a custom Express server (`src/server.js`) and the `json-server` toolkit for rapid prototyping and manipulation of the data placed under `data/`.

## Project Highlights
- **Express server** with CRUD routes for posts (and simple readers for comments) wired to the shared JSON data file.
- **Hot reloading** via `nodemon --legacy-watch` for environments where file watching is limited.
- **JSON Server compatibility** so you can spin up additional mock endpoints or explore the dataset with zero coding.

## Prerequisites
- Node.js 18 or newer (LTS recommended)
- npm 9+ (bundled with Node.js)

Verify your versions:

```bash
node --version
npm --version
```

## Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Review the sample dataset in `data/db.json` and tailor it to your needs. The structure includes `posts`, `comments`, and `users` collections by default.

## Running the Express API
The primary development server is defined in `src/server.js`. It exposes CRUD operations against the `posts` collection and read-only access for `comments`.

Start it with nodemon:

```bash
npm start
```

- The server listens on `http://localhost:3000`.
- Requests are read/written directly against `data/db.json`.
- Newly created posts receive incremental numeric IDs.

### Available Endpoints
| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/posts` | List all posts |
| GET | `/posts/:id` | Get a single post by ID |
| POST | `/posts` | Create a new post (provide JSON body) |
| PUT | `/posts/:id` | Update an existing post |
| DELETE | `/posts/:id` | Remove a post |
| GET | `/comments` | List all comments |

#### Sample `curl` requests
```bash
# List posts
curl http://localhost:3000/posts

# Create a post
curl -X POST http://localhost:3000/posts \
  -H 'Content-Type: application/json' \
  -d '{"title":"New Article","userId":3}'

# Update a post
curl -X PUT http://localhost:3000/posts/1 \
  -H 'Content-Type: application/json' \
  -d '{"title":"Revised Title"}'

# Delete a post
curl -X DELETE http://localhost:3000/posts/3
```

Changes made through the API immediately persist in `data/db.json`.

## Using JSON Server
This project also bundles `json-server` for teams that prefer its full CRUD scaffolding against the same dataset.

Start JSON Server (optional) on a different port:

```bash
npx json-server --watch data/db.json --port 4000 --delay 200
```

- The `--watch` flag keeps the server in sync with edits to `db.json`.
- `--port 4000` avoids clashing with the Express server.
- `--delay 200` simulates network latency; adjust or remove as needed.

JSON Server automatically creates RESTful routes for every top-level key in `db.json`, giving you endpoints such as `/posts`, `/comments`, and `/users` with filtering, sorting, and pagination support out of the box. See the [JSON Server documentation](https://github.com/typicode/json-server) for advanced query patterns.

## Development Tips
- Keep `data/db.json` well-formed JSON; syntax errors will surface in the server logs.
- If you change the data structure, update the Express routes accordingly or rely on JSON Server for ultra-rapid prototyping.
- For production scenarios, consider replacing the flat-file persistence with a database driver and moving secrets into environment variables before deployment.

Happy prototyping!
