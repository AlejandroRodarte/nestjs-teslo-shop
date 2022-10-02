<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## Environment variables required to run the application

### Teslo Shop application

#### `NODE_ENV`

- *Required*
- Type of environment where the application is deployed
- As of now, two values are supported: `development-docker` and `production-docker`

#### `PORT`

- *Optional*
- Port where the application will reside to listen for requests
- Defaults to `3000` if not specified
- Change it to any port that you have available in your computer

#### `POSTGRES_URL`

- *Required*
- Defines the connection URI where the PostgreSQL database is living at
- Set it to a valid PostgreSQL URI

#### `POSTGRES_URL_FILE`

- *Required* when running the application with `docker` and `docker-compose`
- Path (container's filesystem) to the file that contains the PostgreSQL URI
- Do not change it's original value: `/run/secrets/teslo_shop_postgres_url`

#### `HOST_API`

- *Required*
- Defines the URL where this backend is currently living
- Implemented as an environment variables as this URL is highly dependent on the platform where the application will be deployed

#### `JWT_SECRET`

- *Required*
- Defines the secret used to server-sign the JSON Web Tokens emitted by this application for user authentication

#### `JWT_SECRET_FILE`

- *Required* when running the application with `docker` and `docker-compose`
- Path (container's filesystem) to the file that contains the JSON Web Token secret string
- Do not change it's original value: `/run/secrets/teslo_shop_jwt_secret`

### PostgreSQL database

#### `POSTGRES_USER`

- *Optional*
- Superuser username
- Defaults to `postgres` if not specified
- You can change it to whatever username you desire

#### `POSTGRES_PASSWORD_FILE`

- *Required*
- Path (container's filesystem) to the file that contains the password for superuser `POSTGRES_USER`
- Do not change it's original value: `/run/secrets/teslo_shop_postgres_password`

#### `POSTGRES_DB`

- *Required*
- Default database name that will be used upon container creation
- Defaults to `postgres`
- Change it to any database name you desire

## Running the application

### Using `docker` and `docker-compose`

#### Production

1. Open the `docker-compose.yaml` file
2. At `services.teslo-shop.image`, update tag of image `rodarte/nestjs-fr-teslo-shop-prod` to one of the available tags found at the [Docker Hub](https://hub.docker.com/repository/docker/rodarte/nestjs-fr-teslo-shop-prod) repository, or to an image tag that you built in your own computer using the `Dockerfile`
3. At the root of this project, create a `secrets/docker/teslo-shop-postgres/postgres-password.txt` and store the sensible password of superuser `POSTGRES_USER`
4. At the root of this project, create a `secrets/docker/teslo-shop/postgres-url.txt` file and store a string that matches a valid PostgreSQL URI

```txt
postgres://<username>:<password>@<domain>:<port>/<database-name>
```

5. At the root of this project, create a `secrets/docker/teslo-shop/jwt-secret.txt` file and store a strong, secure password string

- `<username>` must be equal to what `POSTGRES_USER` is equal to
- `<password>` must be equal to the string stored at `secrets/docker/teslo-shop-postgres/postgres-password.txt`
- `<domain>` should equal to the service name that hosts our PostgreSQL database, which is called `teslo-shop-postgres`
- `<port>` is the default PostgreSQL port (`5432`)
- `<database-name>` must be equal to what `POSTGRES_DB` is equal to

5. Run command

```sh
docker-compose up
```

#### Development

1. Open the `docker-compose.dev.yaml` file
2. At `services.teslo-shop.image`, update tag of image `rodarte/nestjs-fr-teslo-shop-dev` to one of the available tags found at the [Docker Hub](https://hub.docker.com/repository/docker/rodarte/nestjs-fr-teslo-shop-dev) repository, or to an image tag that you built in your own computer using the `Dockerfile`
3. At the root of this project, create a `secrets/docker/teslo-shop-postgres/postgres-password.txt` and store the sensible password of superuser `POSTGRES_USER`
4. At the root of this project, create a `secrets/docker/teslo-shop/postgres-url.txt` and store a string that matches a valid PostgreSQL URI

```txt
postgres://<username>:<password>@<domain>:<port>/<database-name>
```

5. At the root of this project, create a `secrets/docker/teslo-shop/jwt-secret.txt` file and store a strong, secure password string

- `<username>` must be equal to what `POSTGRES_USER` is equal to
- `<password>` must be equal to the string stored at `secrets/docker/teslo-shop-postgres/postgres-password.txt`
- `<domain>` should equal to the service name that hosts our PostgreSQL database, which is called `teslo-shop-postgres`
- `<port>` is the default PostgreSQL port (`5432`)
- `<database-name>` must be equal to what `POSTGRES_DB` is equal to

5. Run command

```sh
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up
```

## Seeding the database

1. Ensure that the *Nest.js* application and *PostgreSQL* database is running
2. Hit endpoint `GET /seed` to populate the data

> **Beware:** This endpoint deletes ALL products and product images in the database
