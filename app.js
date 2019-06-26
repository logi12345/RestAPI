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
    res.send(db);
});

const responseHandler = (object,res) => {
    res.send(object)
}

const handleError =(req) =>{
    if (!req.body.name) {
       return true;
    }
    //Check the salary field is not blank
    if (!req.body.salary) {
       return true;
    }

    if (!req.body.age) {
       return true;
    }
    return false
}

//Posting a new employee
app.post('/api/v1/create', (req, res) => {
    //handle errors
    if (handleError(req)){
       return responseHandler(false,res);
    }
    //Post a successfully created employee.
    let lastElementID = db.length ===0 ? 0 : db[db.length - 1].id;
    const employee = {
        id: lastElementID + 1,
        employee_name: req.body.name,
        employee_salary: req.body.salary,
        employee_age: req.body.age,
        profile_image: req.body.profile_image ?  req.body.profile_image : ""
    }
    db.push(employee);
    return  responseHandler(employee,res);
});

//Retireve a single employee
app.get('/api/v1/employee/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(db.length ==0){
        return responseHandler(false,res);
    }

    for (let index = 0; index < db.length; index++) {
        if (db[index].id === req.params.id) {
            return responseHandler(db[index],res);
        }
    }
    return responseHandler(false,res);
})

//Delete an employee
app.delete('/api/v1/delete/:id', (req, res) => {
    if(db.length ==0){
        return responseHandler(false,res);
    }
    const id = parseInt(req.params.id, 10);
    for (let index = 0; index < db.length; index++) {
        if (db[index].id === req.params.id) {
            const deletedEmployee = db[index]
            db.splice(index, 1);
            
           return responseHandler(deletedEmployee,res);
        }
    }
    return responseHandler(false,res);
});


//Update an employee record
app.put('/api/v1/update/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    
    if(db.length ==0){
        responseHandler(false,res);
    }
    let found;//Record to update
    let index;//position in store

    //loop until matching ids found
    let i=0;
    while (i < db.length){
        if (db[i].id === req.params.id) {
            found = db[i];
            index = i;
            i=db.length;
        }
        ++i;
    }
    
    //Return a response for invalid id
    if (!found) {
        return responseHandler(false, res);
    }
    if (!req.body.name && !req.body.salary && !req.body.age) {
        return responseHandler(false, res);
    }

    //update employee
    const employeeToUpdate = {
        id: found.id,
        employee_name: req.body.name ? req.body.name : found.employee_name,
        employee_salary: req.body.salary ? req.body.salary : found.employee_salary,
        employee_age: req.body.age ? req.body.age: found.employee_age,
        profile_image: req.body.profile_image ?  req.body.profile_image : found.profile_image
    }

    db.splice(index, 1, employeeToUpdate)
    return responseHandler(employeeToUpdate, res);
})

//listener for connecting to server
const PORT = 5000;
app.listen(PORT, () => {
    console.log("Connected to PORT " + PORT);
});