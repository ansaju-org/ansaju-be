# Ansaju API Documentation

Dokumentasi API untuk aplikasi ansaju

baseurl : `http://localhost:9000/api`

## User API

API untuk kepentingan user

### Registration 

- Endpoint: POST /users/register

- Request Body 
```json 
{
    "nama": "John Doe",
    "email": "johndoe@mail.com",
    "username": "johndoe",
    "password": "rahasia"
}
```

- Response Body (Success)
```json
{
    "error": false,
    "message": "User created successfully",
    "data": {
        "nama": "John Doe",
        "email": "johndoe@mail.com",
        "username": "johndoe"
    }
}
```

- Response Body (Failed)
```json
{
    "error": true,
    "message": "Email already exists"
}
```

### Login

- Endpoint: POST /users/login

- Request Body 
```json 
{
    "username": "johndoe",
    "password": "rahasia"
}
```

- Response Body (Success)
```json
{
    "error": false,
    "message": "User created successfully",
    "data": {
        "nama": "John Doe",
        "email": "johndoe@mail.com",
        "username": "johndoe",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    }
}
```

- Response Body (Failed)
```json
{
    "error": true,
    "message": "Invalid username or password"
}
```
