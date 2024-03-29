# Employee ReSTAPI

Employee ReSTAPI that allows users to POST, DELETE, UPDATE, GET to a local store.

## Getting Started

1.Find a directory to store the project.
2.Within the directory Clone this repo:
```
 git clone https://github.com/logi12345/RestAPI
 ```
## Prerequisites

Make sure you have the following tools installed.

```
node.js
postman
nodemon
```
## How to start

You can use node to start the applicartion

```
node app.js
```
You can use nodemon to continue working on your project while the server is running without connecting and disconnecting.

### Installing nodemon

To install globally to your path.

```
npm install -g nodemon
```
To install it localy for your project.

```
npm install --save-dev nodemon
```

## Starting with nodemon

```
nodemon  app.js
```
## How to use the application

Once the server is running(default port 5000) use postman to test HTTPS requests.

Available requests:
```
GET 
(All employees)
https://localhost:5000/api/v1/employees

(Single employee)
https://localhost:5000/api/v1/employee/{id}

PUT
https://localhost:5000/api/v1/employee/update/{id}

POST
https://localhost:5000/api/v1/create

DELETE
https://localhost:5000/api/v1/employee/delete/{id}
```

