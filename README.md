## .ENV Variables Obligatories
```js
DATABASE_URL="postgresql://postgres:Aa49694941.@localhost:5432/openMarket?schema=public" // url of conection db (postgresql)
JWT_SECRET="secretKey" 
JWT_EXPIRES_IN="1h" // expiration time of jwt
```

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
