const express = require('express');
var router = express.Router();
const Employee = require('../DatabaseSchema');

const SUCCESS = "ok";
const FAIL = "error";

const {
    messages,
    createEmployeeResponses,
    responseText
} = require('../ResponseHandler.js');
employees = Employee;

router.route('/employees')
    .get((req, res) => {
        employees.find({},function (err, result) {
            if (err) {
                throw err
            }
            responseText(res, 200, SUCCESS, [messages.ER], createEmployeeResponses(null, result));
        })
    })
    .post( (req, res) => {
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
                responseText(res, 404, FAIL, err, createEmployeeResponses(employee, null))
             })
        })
    })
    .all();


    

    router.route('/employee/:id')
       .get((req, res) => {
    const id = parseInt(req.params.id, 10);
    employees.findOne({_id:id}).then(
       employee => {
           if(employee===null) {
               responseText(res, 404, FAIL, [messages.EMP_NOT_FOUND], createEmployeeResponses(null, null))            }
           else{
               responseText(res, 200, SUCCESS, [messages.EMP_FOUND], createEmployeeResponses(employee, null))
           }
       }
   )
})
.delete((req, res) => {
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
})
.put((req, res) => {
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
                responseText(res, 404, FAIL, err, createEmployeeResponses(employee, null))
             })
        }else{
            responseText(res, 404, FAIL, [messages.EMP_NOT_UPDATED], createEmployeeResponses(employee, null))
        }
    });
})
 .all()
  module.exports = router;

