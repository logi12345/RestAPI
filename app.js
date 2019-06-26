const express = require('express');
const db = require('./db/db.json');
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

//Get all employees
app.get('/api/v1/employees', (req, res) => {
    return db;
});


const handleError =(req) =>{
    if(db.length==0){
        return false
    }
    if (!req.body.employee_name) {
        return true;
    }
    //Check the salary field is not blank
    if (!req.body.employee_salary) {
        return true;
    }

    if (!req.body.employee_age) {
        return true;
    }

    if (!req.body.profile_image){
        return true;
    }
    return false;
}

//Posting a new employee
app.post('/api/v1/create', (req, res) => {
    //handle errors
    if (handleError(req)){
        return false;
    }
    //Post a successfully created employee.
    let lastElementID = db.length ===0 ? 0 : db[db.length - 1].id;
    const employee = {
        id: lastElementID + 1,
        employee_name: req.body.employee_name,
        employee_salary: req.body.employee_salary,
        employee_age: req.body.employee_age
    }
    db.push(employee);
    return  employee;
});

//Retireve a single employee
app.get('/api/v1/employee/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(db.length ==0){
        return false;
    }
    db.forEach((employee) => {
        if (employee.id === id) {
            return employee;
        }
    })
    return false;
})

//Delete an employee
app.delete('/api/v1/delete/:id', (req, res) => {
    if(db.length ==0){
        return false;
    }
    const id = parseInt(req.params.id, 10);
    for (let index = 0; index < db.length; index++) {
        if (db[index].id === id) {
            const deletedEmployee = db[index]
            db.splice(index, 1);
            
           return deletedEmployee;
        }
    }
    return false;
});


//Update an employee record
app.put('/api/v1/update/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    
    if(db.length ==0){
        return false;
    }
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
        return false;
    }
    if (!req.body.employee_name && !req.body.employee_salary, !req.body.employee_age) {
        return false;
    }

    //update employee
    const employeeToUpdate = {
        id: found.id,
        employee_name: req.body.employee_name ? req.body.employee_name : found.employee_name,
        employee_salary: req.body.employee_salary ? req.body.employee_salary : found.employee_salary,
        employee_age: req.body.employee_age ? req.body.employee_age: found.employee_age
    }

    db.splice(index, 1, employeeToUpdate)
    return responseText(res, 200, SUCCESS, 'Employee updated successfully', employeeToUpdate);
})

//listener for connecting to server
const PORT = 5000;
app.listen(PORT, () => {
    console.log("Connected to PORT " + PORT);
});