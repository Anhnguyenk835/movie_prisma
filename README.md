## Setup

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:

    - Create a `.env` file in the root directory.
    - or run this command:

    ```bash
    cp .env.example .env
    ```

    - Add your database connection string and port:
      ```env
      SUPABASE_URL="postgresql://user:password@host:port/database?schema=movie_prisma"
      PORT=8000
      ```

4.  **Run Database Migrations**:
    - This will create the necessary tables in the `movie_prisma` schema.
    ```bash
    npx prisma migrate dev --name init
    ```
    - For skipping migration, run this command:
    ```bash
    npx prisma db push
    ```
    - Run generate command:
    ```bash
    npx prisma generate
    ```

## Running the Server

- **Development Mode** (with hot-reloading):

  ```bash
  npm run dev
  ```

The server will start on `http://localhost:8000` (or the port specified in `.env`).

## API Testing

You can use `curl`, Postman, or any API client to test the endpoints.

### Directors

#### Create a Director

```bash
curl -X POST http://localhost:8000/directors \
  -H "Content-Type: application/json" \
  -d '{"name": "Christopher Nolan"}'
```

#### Get All Directors

```bash
curl http://localhost:8000/directors
```

#### Update a Director

```bash
curl -X PUT http://localhost:8000/directors/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Chris Nolan"}'
```

#### Delete a Director

```bash
curl -X DELETE http://localhost:8000/directors/1
```

### Movies

#### Create a Movie

_Note: Replace `directorId` with a valid ID from the Directors list._

```bash
curl -X POST http://localhost:8000/movies \
  -H "Content-Type: application/json" \
  -d '{"title": "Inception", "revenue": 836.8, "directorId": 1}'
```

#### Get All Movies

Returns movies with their associated director.

```bash
curl http://localhost:8000/movies
```

#### Update a Movie

```bash
curl -X PUT http://localhost:8000/movies/1 \
  -H "Content-Type: application/json" \
  -d '{"revenue": 850.0}'
```

#### Delete a Movie

```bash
curl -X DELETE http://localhost:8000/movies/1
```
