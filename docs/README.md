# Ansaju API Documentasi

Base Url : `https://ansaju-api.ikhlashmulya.my.id/`

## Login

- endpoint `POST /login`

- request body
    - `username` as `string`
    - `password` as `string`

- example request
```json
{
    "username": "johndoe",
    "password": "secretpassword"
}
```

- response
```json
{
    "error": true,
    "message": "success login user",
    "data": {
        "name": "John Doe",
        "email": "johndoe@mail.com",
        "username": "johndoe",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    }
}
```

## Register

- endpoint `POST /register`

- request body
    - `name` as `string`
    - `email` as `string`, string must be valid email format
    - `username` as `string`
    - `password` as `string`, password must be longer than 8 characters

- example request
```json
{
    "name": "John Doe",
    "email": "johndoe@mail.com",
    "username": "johndoe",
    "password": "secretpassword"
}
```

- response 
```json
{
    "error": false,
    "message": "User created successfully",
    "data": {
        "name": "John Doe",
        "username": "johndoe",
        "email": "johndoe@mail.com"
    }
}
```

## Get Recommendation

- endpoint `POST /recommendations`

- headers
    - `Authorization` : `Bearer <token>`

- request body
    - `answer` as `array of int`, array length must be 12 and each value contains an integer 1 - 5

- example request
```json
{
    "answer": [1,4,3,2,2,5,5,2,3,3,2,1]
}
```

- response 
```json
{
    "error": false,
    "message": "success get recommendation",
    "data": {
        "jurusan": "Teknik Informatika"
    }
}
```

## Get Recommendation History

- endpoint `GET /recommendations/history`

- headers
    - `Authorization` : `Bearer <token>`

- query parameters
    - `page` as `int`, optional default 1
    - `limit` as `int`, optional default 5

- response 
```json
{
    "error": false,
    "message": "success get recommendation history",
    "data": [
        {
            "id": 10,
            "jurusan": "Teknik Informatika",
            "created_at": "2025-01-08T06:34:18.598Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 5
    }
}
```
