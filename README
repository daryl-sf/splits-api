# Splits API

An API for the Splits app. Manage races, splits, and more.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Database Migrations](#database-migrations)
- [Swagger Documentation](#swagger-documentation)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone git@github.com:daryl-sf/splits-api.git
    cd splits-api
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    - Copy the `.env.example` to `.env` and fill in the required values.

## Usage

### Development

To start the development server with hot-reloading:

```sh
npm run dev
```

### Production

To build the project and start the production server:

```sh
npm run build
npm start
```

## API Endpoints

The API endpoints are documented using Swagger. You can view the Swagger documentation by visiting the `/api-docs` route on the server.

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: The URL of the PostgreSQL
- `JWT_SECRET`: The secret key used to sign JWT tokens
- `REDIS_URL`: The URL of the Redis server

The following environment variables are optional:
- `PORT`: The port on which the server will run
- `HOST`: The host on which the server will run
- `NODE_ENV`: The environment in which the server is running

## Database Migrations

To run database migrations, use the Prisma CLI:

```sh
npx prisma migrate dev
```

To create a new migration:

```sh
npx prisma migrate save --name <migration-name>
```

## Swagger Documentation

The Swagger documentation is generated using Swagger UI Express. You can view the documentation by visiting the `/api-docs` route on the server.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
