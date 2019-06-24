const express = require('express');
const db = require('./db/db');
const bodyParser = require('body-parser');


const SUCCESS = "true";
const FAIL = "false";

//Initiialise express
const app = express();

//Setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//Setup response
const responseText = (res, errorCode, isSuccessString, message, Result) =>{
    res.status(errorCode).send({
        success: isSuccessString,
        messsage: message,
        Result
    })
}

//Get all employees
app.get('/api/v1/employees', (req, res) => {
    responseText(res, 200, SUCCESS, 'Employees retrieved successfully',  db );
});


//Posting a new employee
app.post('/api/v1/create', (req, res) => {
    //Check the name field is not blank
    if (!req.body.name) {
        return responseText(res, 400, FAIL, 'Name is required');
    }
    //Check the role field is not blank
    if (!req.body.role) {
        return esponseText(res, 400, FAIL, 'Role is required');
    }
    //Post a successfully created employee.
    let lastElementID = db[(db.length) - 1].id;
    const employee = {
        id: lastElementID + 1,
        name: req.body.name,
        role: req.body.role
    }
    db.push(employee);
    return responseText(res, 200, SUCCESS, 'Employee Added successfully', employee);
});

//Retireve a single employee
app.get('/api/v1/employee/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.forEach((employee) => {
        if (employee.id === id) {
            return responseText(res, 200, SUCCESS, 'Employee retrieved successfully', employee);
        }
    })
    return responseText(res, 404, FAIL, 'Employee not found', employee);
})

//Delete an employee
app.delete('/api/v1/employee/delete/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    for (let index = 0; index < db.length; index++) {
        if (db[index].id === id) {
            db.splice(index, 1);
            return responseText(res, 200, SUCCESS, 'Employee deleted successfully', employee);
        }
    }
    return responseText(res, 404, FAIL, 'Employee not found', employee);
});


//Update an employee record
app.put('/api/v1/employee/update/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    console.log(id);
    let found;//Record to update
    let index;//position in store

    //loop until matching ids found
    let i=0;
    while (i < db.length){
        if (db[i].id === id) {
            found = db[i];
            index = i;
            i=db.length;
        }
        ++i;
    }
    
    //Return a response for invalid id
    if (!found) {
        return responseText(res, 404, FAIL, 'Employee not found');
    }
    if (!req.body.name && !req.body.role) {
        return responseText(res, 400, FAIL, 'Nothing to update');
    }

    //update employee
    const employeeToUpdate = {
        id: found.id,
        name: req.body.name ? req.body.name : found.name,
        role: req.body.role ? req.body.role : found.role,
    }

    db.splice(index, 1, employeeToUpdate)
    return responseText(res, 200, SUCCESS, 'Employee updated successfully', employeeToUpdate);
})

//listener for connecting to server
const PORT = 5000;
app.listen(PORT, () => {
    console.log("Conneceted to PORT " + PORT);
});