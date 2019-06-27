//npm packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongodb = require('mongodb');

//internal modules
const url = 'mongodb://127.0.0.1:27017/company';
const Employee = require('./DatabaseSchema')
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
    NA : "Method not allowed.",
    SR : "Salary required",
    NR : "Name required",
    AR : "Age required",
    EU : "Employee updated",
    EC : "Employee created",
    ED : "Employee deleted",
    NF : "Employee not found"
}

const createEmployeeResponses = (employee, employees) => {
    return {
        employee : employee,
        employees: employees
    }
}

createResponse = (errorCode, isSuccessString, messages, result) => {
    let message = {
        status: isSuccessString,
        code: errorCode,
        messages: messages,
        result: result
    }
    return message;
}

mongoose.connect(url,{useNewUrlParser:true})
db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

employees = Employee;

// connection.handleConnection(employees,(tempdb)=>{
//     let db=tempdb;

//     if(process.argv[2] === "new"){
//             db.createCollection( "employees", {
//                 validator: { $jsonSchema: {
//                    bsonType: "object",
//                    required: [ "employee_name", "employee_salary", "employee_age" ],
//                    properties: {
//                       _id: {
//                          bsonType: "int",
//                          description: "User id"
//                       },
//                       employee_name: {
//                          bsonType: "string",
//                          description: "must be a string and is required"
//                       },
//                       employee_role: {
//                          bsonType : "string",
//                          description: "position"
//                       },
//                       employee_salary: {
//                          bsonType: "int",
//                          description: "must be a string and is required"
//                       },
//                       employee_age: {
//                          bsonType: "int",
//                          description: "must be a string and is required"
//                       },
//                       profile_picture: {
//                          bsonType: "string",
//                          description: "must be a string and is required"
//                       }
//                    }
//                 }},
//                 validationAction: "error"
//              }).then(() =>{
//                 app.listen(PORT, () => {
//                     console.log("Conneceted to PORT " + PORT);
//                 });
            
//                 console.log(process.argv)
            
//                 employees = db.collection('employees');
//              }).catch((err) =>{
//                 console.log(err);
//              })
//     }
// });


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
        responseText(res, 200, SUCCESS, [], createEmployeeResponses(null, result));
    })
});

//Posting a new employee
app.post('/api/v2/create', (req, res) => {
    //Check the name field is not blank
    if (!req.body.name && !req.body.salary && !req.body.age) {
        responseText(res, 400, FAIL, [messages.NR, messages.SR, messages.AR], createEmployeeResponses(null, null))
        return
    }
    //Check the role field is not blank
    if (!req.body.name && !req.body.salary) {
        responseText(res, 400, FAIL, [messages.NR, messages.SR], createEmployeeResponses(null , null))
        return
    }
    if (!req.body.name && !req.body.age) {
        responseText(res, 400, FAIL, [messages.NR, messages.AR], createEmployeeResponses(null, null))
        return
    }

    if (!req.body.age && !req.body.salary) {
        responseText(res, 400, FAIL, [messages.AR, messages.SR], createEmployeeResponses(null, null))
        return
    }
    if (!req.body.age) {
        responseText(res, 400, FAIL, [messages.AR], createEmployeeResponses(null, null))
        return
    }
    if (!req.body.salary) {
        responseText(res, 400, FAIL, [messages.SR], createEmployeeResponses(null, null))
        return
    }
    if (!req.body.name) {
        responseText(res, 400, FAIL, [messages.NR], createEmployeeResponses(null, null))
        return
    }
    employees.find({}, (err, result) => {
        if (err) {
            throw err
        }

        //Post a successfully created employee.
        let lastElementID = result.length === 0 ? 0 : parseInt(result[(result.length) - 1].id);
        const employee = new Employee({
            _id: lastElementID + 1,
            name: req.body.name,
            role: req.body.role ? req.body.role : "",
            salary: req.body.salary,
            age: req.body.age,
            profile_image: req.body.profile_image ? req.body.profile_image : ""
        })
        employee.save().then(result=>{
            console.log(result);
            responseText(res, 200, SUCCESS, [], createEmployeeResponses(employee, null))
        }).catch((err) =>{
            responseText(res, 200, FAIL, [], createEmployeeResponses(employee, null))
         })
        // employees.insertOne(employee).catch((err) =>{
        //     console.log(err)
        //  })
        // responseText(res, 200, SUCCESS, [], createEmployeeResponses(employee, null))
    })
});


//Retireve a single employee
app.get('/api/v2/employee/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
     employees.findOne({_id:id}).then(
        employee => {
            if(employee===null) {
                responseText(res, 400, FAIL, [messages.NF], createEmployeeResponses(null, null))            }
            else{
                responseText(res, 200, SUCCESS, [], createEmployeeResponses(employee, null))
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
                responseText(res, 404, FAIL, [messages.NF], createEmployeeResponses(null, null));
            }
            else{
                employees.deleteOne({_id:id}).then(() =>{
                    responseText(res, 200, SUCCESS, [], createEmployeeResponses(employee, null));  
                })
            }
        }
    )
});


//Update an employee record
app.put('/api/v2/employee/update/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!req.body.name && !req.body.role && !req.body.salary && !req.body.age &&  !req.body.profile_imag) {
        console.log(inside)
        responseText(res, 400, FAIL, ['Nothing to update'], createEmployeeResponses(null, null));
        return
    }


    employees.findOne({_id: id}, function(err, employee) {
        if(!err) {
                        employee.name =req.body.name ? req.body.name: "",
                        employee.role= req.body.role ? req.body.role : "",
                        employee.salary= req.body.salary ? req.body.salary : "",
                        employee.age= req.body.age? req.body.age : "",
                        employee.profile_image= req.body.profile_image ? req.body.profile_image : ""
             
            employee.save().then(
                (result) =>{
                    if(result){
                        return responseText(res, 200, SUCCESS, [], createEmployeeResponses(reslult, null));
                    }else{
                        return responseText(res, 404, FAIL, [messages.NF], createEmployeeResponses(null, null));
                    }
                }
            );
        }
    });



    // function(err) {
    //     if(err){
    //         console.log(err)
    //         return responseText(res, 404, FAIL, [messages.NF], createEmployeeResponses(null, null));

    //     }else{
    //         return responseText(res, 200, SUCCESS, [], createEmployeeResponses(doc, null));
    //     }
    // }
    // const x = {
    //     name:  "",
    //     role: "",
    //     salary:  "",
    //     age: "",
    //     profile_image: ""
    // }


    // if (!req.body.name){
    //     x.name = req.body.name
    // }
    // if (!req.body.role){
    //     x.role= req.body.role
    // }
    // if (!req.body.salary){
    //     x.salary = req.body.salary
    // }
    // if (!req.body.age){
    //     x.age = req.body.age
    // }
    // if (!req.body.profile_image){
    //     x.profile_image= req.body.profile_image
    // }

    // employees.findOneAndUpdate({_id:id}, x, {upsert:true}, function(err, doc){
    //             if(err){

    //                 console.log(JSON.stringify(x))
    //                 return responseText(res, 404, FAIL, [messages.NF], createEmployeeResponses(null, null));

    //             }else{
    //                 return responseText(res, 200, SUCCESS, [], createEmployeeResponses(doc, null));
    //             }
    // });


    // employees.findOne({id:id}).then(
    //     employee => {
    //         if(employee===null) {
    //             responseText(res, 404, FAIL, [messages.NF], createEmployeeResponses(null, null));
    //             return
    //         }
    //         else{
    //             MyModel.findOneAndUpdate(, req.newData, {upsert:true}, function(err, doc){
    //                 if (err) return res.send(500, { error: err });
    //                 return res.send("succesfully saved");
    //             });
                

                // employees.updateOne({
                //     _id: id
                // }, {
                //     $set: {
                //         name: req.body.name ? req.body.name: "",
                //         role: req.body.role ? req.body.role : "",
                //         salary: req.body.salary ? req.body.salary : "",
                //         age: req.body.age? req.body.age : "",
                //         profile_image: req.body.profile_image ? req.body.profile_image : ""
                //     }
                // }).then(() =>{
                //     employees.findOne({id:id}).then((updatedEmployee) => {
                //         responseText(res, 200, SUCCESS, [], createEmployeeResponses(employee, null));  
                //     })                   
                // })
            // }
        // }
    // )
})

app.all('/*', (req, res) => {
    responseText(res, 405, FAIL, [messages.NA], createEmployeeResponses(null, null));
})

app.listen(PORT, () => {
                      console.log("Conneceted to PORT " + PORT);
               });

module.exports = app


// JSON EXAMPLE - /employees GET

// {
//     "status": "ok",
//     "code": 200,
//     "messages": [],
//     "result": {
//         "employee": null,
// 		"employees": [{"id":1, "name":"ted" ....}, {"id":2, "name":"ted2" ....}]
//     }
// }

// JSON EXAMPLE - /employees/{id}

// {
//     "status": "ok",
//     "code": 200,
//     "messages": [],
//     "result": {
//         "employee": {"id":1, "name":"ted" ....},
// 		"employees": null
//     }
// }

// JSON EXAMPLE - /employees POST

// {
//     "status": "ok",
//     "code": 200,
//     "messages": [{"text":"Employee created."}],
//     "result": {
//         "employee": {"id":6, "name":"fred" ....},
// 		"employees": null
//     }
// }

// JSON EXAMPLE - /employees/{id} PUT

// {
//     "status": "ok",
//     "code": 200,
//     "messages": [{"text":"Employee updated."}],
//     "result": {
//         "employee": {"id":6, "name":"fred77" ....},
// 		"employees": null
//     }
// }

// JSON EXAMPLE - Method not allowed

// {
//     "status": "error",
//     "code": 405,
//     "messages": [{"text":"Method no allowed."}],
//     "result": null
// }

// JSON EXAMPLE - Required field missing

// {
//     "status": "error",
//     "code": 400,
//     "messages": [{"text":"Name is required."},{"text":"Salary is required."}],
//     "result": null
// }
