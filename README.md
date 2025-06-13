# Ansaju API

This is the backend system for the [Ansaju](https://ansaju.netlify.app/)

## Features

- User Authentication with JWT
- Save history recommendation
- Call model machine learning

## Tech Stack 

- NodeJS (runtime)
- HapiJS (http web framework)
- JWT (auth token)
- Docker (for deployment)
- Postgres (database)
- Prisma (ORM)
- Jest (unit testing)

## Architecture 
![](docs/arsitektur%20backend%20ansaju.png)

This project follows clean architecture principles, designed to separate concerns across different functional domains. Below is an explanation of each component and how they interact:

### User Domain

This domain is responsible for user-related operations such as authentication and registration.

- **User Handler**  
  Acts as the HTTP controller layer. It receives incoming HTTP requests and forwards them to the service layer.

- **User Service**  
  Contains business logic related to users. It validates input and coordinates calls to the repository layer.

- **User Repository**  
  An abstraction over the data access logic. It defines operations for persisting user data.

- **Prisma Repository**  
  Concrete implementation for user repository using Prisma ORM.

### Recommendation Domain

This domain manages recommendation logic such as stored data history and call external machine learning models.

- **Recommendation Handler**  
  Acts as the HTTP controller layer. It receives incoming HTTP requests and forwards them to the service layer.

- **Recommendation Service**  
  Contains the business logic for generating or retrieving recommendations. It coordinates with both the data repository and the ML provider.

- **Recommendation Repository**  
  An abstraction over the data access logic. It defines operations for persisting recommendation data.

- **ML Provider**  
  An abstraction for calling machine learning model. It defines operations for fetching to external Model API.

- **Prisma Repository**  
  Concrete implementation for recommendation repository using Prisma ORM.

- **Model API (external)**  
  Concrete implementation for ML Provider. It sends HTTP requests to an external Model API for machine learning.

### Flow Summary

- User-related operations go through:
  
  User Handler → User Service → User Repository → Prisma Repository.

- Recommendation operations go through:
  
  Recommendation Handler → Recommendation Service →
    - Recommendation Repository → Prisma Repository, and/or
    - ML Provider → HTTP call to external ML Model API.

### Design Principles

- **Separation of concerns**: Each layer has a clearly defined responsibility.
- **Scalability**: Components are modular and easily replaceable or extendable.
- **Testability**: Each module can be unit tested independently.

## Documentation API

See the documentation at [https://ansaju-org.github.io/ansaju-be/](https://ansaju-org.github.io/ansaju-be/)

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
- APP_MODEL_API_TOKEN : token for auth model ml api
- APP_MODEL_API_URL : url model ml api, run [ansaju-model-api](https://github.com/ansaju-org/ansaju-model-api)

```bash
npx prisma generate
npx prisma migrate dev
npm run start-dev
```
