# 🚧 Ansaju API – Work in Progress

## Running App locally
```bash
npm install
cp .env.example .env
```
required environment :
- APP_PORT : for application port
- APP_HOST : for application host
- APP_LOG_LEVEL : for application log level (debug, info, warn, error)
- APP_JWT_SECRET : for jwt secret key
- DATABASE_URL : for database connection string

```bash
npx prisma generate
npx prisma migrate dev
npm run start-dev
```