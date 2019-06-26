const express = require('express');
const bodyParser = require('body-parser');
//listener for connecting to server
const PORT = 5000;
const mongodb =require('mongodb').MongoClient;
const  util = require('util');
const url = 'mongodb://127.0.0.1:27017'

let collection;
let employees;
let employeesJSON;

const SUCCESS = "true";
const FAIL = "false";

//Initiialise express
const app = express();

//Setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

mongodb.connect(url, {useNewUrlParser:true}, (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    app.listen(PORT, () => {
        console.log("Conneceted to PORT " + PORT);
    });
    const db = client.db('company');
    employees = db.collection('employees');
  })

   

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
   employees.find().toArray(function (err, result) {
        if (err){ 
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
        if (err){ 
            throw err
        }
        //Post a successfully created employee.
        
        let lastElementID = result.length===0? 0:result[(result.length) - 1].id;
        const employee = {
                            id: lastElementID + 1,
                            name: req.body.name,
                            role: req.body.role
                         }
        employees.insertOne(employee);
      return  responseText(res, 200, SUCCESS, 'Employee Added successfully', employee);
    })
});


//Retireve a single employee
app.get('/api/v1/employee/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    employees.find().toArray((err, result) => {
    for (let index = 0; index < result.length; index++) {
        if (result[index].id === id) {
            return responseText(res, 200, SUCCESS, 'Employee retrieved successfully', result[index]);
        }
    }
    return responseText(res, 404, FAIL, 'Employee not found');
})
})

//Delete an employee
app.delete('/api/v1/employee/delete/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    employees.find().toArray((err, result) => {
    for (let index = 0; index < result.length; index++) {
        if (result[index].id === id) {
            const deletedEmployee = result[index]
            employees.deleteOne({id:id});
            
            return responseText(res, 200, SUCCESS, 'Employee deleted successfully', deletedEmployee);
        }
    }
    return responseText(res, 404, FAIL, 'Employee not found');
});
});


//Update an employee record
app.put('/api/v1/employee/update/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    employees.find().toArray((err, result) =>{
    let found;//Record to update
    let index;//position in store

    //loop until matching ids found
    let i=0;
    if (result.length === 0) return responseText(res, 404, FAIL, 'Employee not found');
    while (i < result.length){
        if (result[i].id === id) {
            found = result[i];
            index = i;
            i=result.length;
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
    
    employees.updateOne({id:id},{$set:{name: employeeToUpdate.name, role : employeeToUpdate.role}})

    //result.splice(index, 1, employeeToUpdate)
    return responseText(res, 200, SUCCESS, 'Employee updated successfully', employeeToUpdate);
})
})
