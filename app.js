//npm packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongodb = require('mongodb');

//internal modules
const url = 'mongodb://127.0.0.1:27017/company';
const Employee = require('./DatabaseSchema');

// const connection = require('./DatabaseConnection');

let db;
let employees;

const PORT = 5000;
const SUCCESS = "ok";
const FAIL = "error";

//Initiialise express
const app = express();

//Setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


const messages =  {
    NOT_ALLOWED:{NOT_ALLOWED : "Method not allowed."},
    SAL_REQ:{SAL_REQ : "Salary required"},
    NAME_REQ:{NAME_REQ : "Name required"},
    AGE_REQ:{AGE_REQ : "Age required"},
    EMP_UPDATED:{EMP_UPDATED : "Employee updated"},
    EMP_CREATED:{EMP_CREATED : "Employee created"},
    EMP_DELETED:{EMP_DELETED : "Employee deleted"},
    EMP_FOUND:{EMP_FOUND : "Employee found"},
    EMP_NOT_FOUND:{EMP_NOT_FOUND : "Employee not found"},
    EMP_NOT_CREATED:{EMP_NOT_CREATED : "Employee not created"},
    EMP_NOT_UPDATED:{EMP_NOT_UPDATED : "Employee not updated"},
    EMP_RETRIEVED:{EMP_RETRIEVED :"Employee retrieved"},
    NOTH_UPDATE:{NOTH_UPDATE: "Nothing to update"}
}

const createEmployeeResponses = (employee, employees) => {
    return {
        employee : employee,
        employees: employees
    }
}

mongoose.connect(url,{useNewUrlParser:true})
db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

employees = Employee;

//Setup response
const responseText = (res, errorCode, isSuccessString, message, result) => {
    res.status(errorCode).send({
        status: isSuccessString,
        code:errorCode,
        messsage: message, result})
}

//Get all employees
app.get('/api/v2/employees', (req, res) => {
    employees.find({},function (err, result) {
        if (err) {
            throw err
        }
        responseText(res, 200, SUCCESS, [messages.ER], createEmployeeResponses(null, result));
    })
});



//Posting a new employee
app.post('/api/v2/create', (req, res) => {
    //Check the name field is not blank

    //let error = employee.validateSync();
    // if (!req.body.name && !req.body.salary && !req.body.age) {
    //     responseText(res, 400, FAIL, [messages.NAME_REQ, messages.SAL_REQ, messages.AGE_REQ], createEmployeeResponses(null, null))
    //     return
    // }
    // //Check the role field is not blank
    // if (!req.body.name && !req.body.salary) {
    //     responseText(res, 400, FAIL, [messages.NAME_REQ, messages.SAL_REQ], createEmployeeResponses(null , null))
    //     return
    // }
    // if (!req.body.name && !req.body.age) {
    //     responseText(res, 400, FAIL, [messages.NAME_REQ, messages.AGE_REQ], createEmployeeResponses(null, null))
    //     return
    // }

    // if (!req.body.age && !req.body.salary) {
    //     responseText(res, 400, FAIL, [messages.AGE_REQ, messages.SAL_REQ], createEmployeeResponses(null, null))
    //     return
    // }
    // if (!req.body.age) {
    //     responseText(res, 400, FAIL, [messages.AGE_REQ], createEmployeeResponses(null, null))
    //     return
    // }
    // if (!req.body.salary) {
    //     responseText(res, 400, FAIL, [messages.SAL_REQ], createEmployeeResponses(null, null))
    //     return
    // }
    // if (!req.body.name) {
    //     responseText(res, 400, FAIL, [messages.NAME_REQ], createEmployeeResponses(null, null))
    //     return
    // }
    employees.find({}, (err, result) => {
        if (err) {
            throw err
        }

        let lastElementID = result.length === 0 ? 0 : parseInt(result[(result.length) - 1].id);


        const employee = new Employee({
            _id: lastElementID +1,
            name: req.body.name,
            role: req.body.role ? req.body.role : "",
            salary: req.body.salary,
            age: req.body.age,
            profile_image: req.body.profile_image ? req.body.profile_image : ""
        })
        employee.save().then(result=>{
           // console.log(result);
            responseText(res, 200, SUCCESS, [messages.EMP_CREATED], createEmployeeResponses(employee, null))
        }).catch((err) =>{
            //console.log(err)
            responseText(res, 400, FAIL, err, createEmployeeResponses(employee, null))
         })
    })
});


//Retireve a single employee
app.get('/api/v2/employee/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
     employees.findOne({_id:id}).then(
        employee => {
            if(employee===null) {
                responseText(res, 400, FAIL, [messages.EMP_NOT_FOUND], createEmployeeResponses(null, null))            }
            else{
                responseText(res, 200, SUCCESS, [messages.EMP_FOUND], createEmployeeResponses(employee, null))
            }
        }
    )
    
})

//Delete an employee
app.delete('/api/v2/employee/delete/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    employees.findOne({_id:id}).then(
        employee => {
            if(employee===null) {
                responseText(res, 404, FAIL, [messages.EMP_NOT_FOUND], createEmployeeResponses(null, null));
            }
            else{
                employees.deleteOne({_id:id}).then(() =>{
                    responseText(res, 200, SUCCESS, [messages.EMP_DELETED], createEmployeeResponses(employee, null));  
                })
            }
        }
    )
});


//Update an employee record
app.put('/api/v2/employee/update/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!req.body.name && !req.body.role && !req.body.salary && !req.body.age &&  !req.body.profile_imag) {
        responseText(res, 400, FAIL, [messages.NOTH_UPDATE], createEmployeeResponses(null, null));
        return
    }


    employees.findOne({_id: id}, function(err, employee) {
        if(employee!==null) {

            console.log(employee)
                        employee.name =req.body.name ? req.body.name: "",
                        employee.role= req.body.role ? req.body.role : "",
                        employee.salary= req.body.salary ? req.body.salary : "",
                        employee.age= req.body.age? req.body.age : "",
                        employee.profile_image= req.body.profile_image ? req.body.profile_image : ""
             
            employee.save().then(
                (result) =>{
                    console.log(result)
                    if(result){
                        return responseText(res, 200, SUCCESS, [messages.EMP_UPDATED], createEmployeeResponses(result, null));
                    }else{
                        return responseText(res, 404, FAIL, [messages.EMP_NOT_FOUND], createEmployeeResponses(null, null));
                    }
                }
            ).catch((err) =>{
                //console.log(err)
                responseText(res, 400, FAIL, err, createEmployeeResponses(employee, null))
             })
        }else{
            responseText(res, 400, FAIL, [messages.EMP_NOT_UPDATED], createEmployeeResponses(employee, null))
        }
    });
})

app.all('/*', (req, res) => {
    responseText(res, 405, FAIL, [messages.NOT_ALLOWED], createEmployeeResponses(null, null));
})

app.listen(PORT, () => {
                      console.log("Connected to PORT " + PORT);
               });

module.exports = app
