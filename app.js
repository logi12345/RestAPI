//npm packages
const express = require('express');
const bodyParser = require('body-parser');

//internal modules
const connection = require('./DatabaseConnection');
let employees;

const PORT = 5000;
const SUCCESS = "true";
const FAIL = "false";

//Initiialise express
const app = express();

//Setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

connection.handleConnection(employees,(tempdb)=>{
    let db=tempdb;
    app.listen(PORT, () => {
        console.log("Conneceted to PORT " + PORT);
    });
    employees = db.collection('employees');
});


//Setup response
const responseText = (res, errorCode, isSuccessString, message, Result) => {
    res.status(errorCode).send({
        success: isSuccessString,
        messsage: message,
        Result
    })
}

//Get all employees
app.get('/api/v1/employees', (req, res) => {
    employees.find().toArray(function (err, result) {
        if (err) {
            throw err
        }
        responseText(res, 200, SUCCESS, 'Employees retrieved successfully', result);
    })
});

//Posting a new employee
app.post('/api/v1/create', (req, res) => {
    //Check the name field is not blank
    if (!req.body.name) {
        return responseText(res, 400, FAIL, 'Name is required');
    }
    //Check the role field is not blank
    if (!req.body.role) {
        return responseText(res, 400, FAIL, 'Role is required');
    }
    employees.find().toArray((err, result) => {
        if (err) {
            throw err
        }

        //Post a successfully created employee.
        let lastElementID = result.length === 0 ? 0 : result[(result.length) - 1].id;
        const employee = {
            id: lastElementID + 1,
            name: req.body.name,
            role: req.body.role
        }
        employees.insertOne(employee);
        return responseText(res, 200, SUCCESS, 'Employee Added successfully', employee);
    })
});


//Retireve a single employee
app.get('/api/v1/employee/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
     employees.findOne({id:id}).then(
        employee => {
            if(employee===null) {
                responseText(res, 404, FAIL, 'Employee not found');
            }
            else{
                responseText(res, 200, SUCCESS, 'Employee retrieved successfully', employee);
            }
        }
    )
    
})

//Delete an employee
app.delete('/api/v1/employee/delete/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    employees.findOne({id:id}).then(
        employee => {
            if(employee===null) {
                responseText(res, 404, FAIL, 'Employee not found');
            }
            else{
                employees.removeOne({id:id}).then(() =>{
                    responseText(res, 200, SUCCESS, 'Employee deleted successfully', employee);  
                })
            }
        }
    )
});


//Update an employee record
app.put('/api/v1/employee/update/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!req.body.name && !req.body.role) {
        return responseText(res, 400, FAIL, 'Nothing to update');
    }
    employees.findOne({id:id}).then(
        employee => {
            if(employee===null) {
                responseText(res, 404, FAIL, 'Employee not found');
            }
            else{
                employees.updateOne({
                    id: id
                }, {
                    $set: {
                        name: req.body.name,
                        role: req.body.role
                    }
                }).then(() =>{
                    employees.findOne({id:id}).then((updatedEmployee) => {
                        responseText(res, 200, SUCCESS, 'Employee updated successfully', updatedEmployee);
                    })                   
                })
            }
        }
    )
})

module.exports = app