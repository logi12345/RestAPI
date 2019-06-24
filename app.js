const express = require('express');
const db = require('./db/db');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/api/v1/employees', (req, res) => {
    res.status(200).send({
        success: 'true',
        messsage: 'employees recieved successfully',
        employees: db
    })
});

app.post('/api/v1/create', (req, res) => {

    console.log(req.body);
    if (!req.body.name) {
        return res.status(400).send({
            success: 'false',
            message: 'name is required'
        });
    }
    if (!req.body.role) {
        return res.status(400).send({
            success: 'false',
            message: 'role is required'
        });
    }
        let lastElementID = db[db.length-1]+1;
        const employee = {
        id: lastElementID + 1,
        name: req.body.name,
        role: req.body.role
    }
    db.push(employee);
    return res.status(201).send({
        success: 'true',
        message: 'todo added successfully',
        employee
    })

});

app.get('/api/v1/employee/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.forEach((employee) => {
        if (employee.id === id) {
            return res.status(200).send({
                success: 'true',
                message: 'employee retrieved successfully',
                employee
            })
        }

    })

    return res.status(404).send({
        success: 'false',
        message: 'todo does not exist',
    })
})

app.delete('/api/v1/employee/delete/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    for (let index = 0; index < db.length; index++){
            if (db[index].id === id) {
                db.splice(index, 1);
                return res.status(200).send({
                    success: 'true',
                    message: 'Employee deleted successful',
                })

            }
    }
    return res.status(404).send({
        success:'false',
        message: 'Employee not found'

    })
});

app.put('/api/v1/employee/update/:id', (req,res)=>{
    const id = parseInt(req.params.id, 10);
    console.log(id);
    let found;
    let index;
    for (let i = 0; i < db.length; i++) {
        if(db[i].id === id){
            found = db[i];
            index = i;
        } 
    }
    console.log(found);
    if(!found){
        return res.status(404).send({
            success:'false',
            message: 'Employee not found'
        })
    }
    if(!req.body.name && !req.body.role){
        return res.status(404).send({
            success:'false',
            message: 'Nothing to update'
        })
    }

    const employeeToUpdate = {
        id: found.id,
        name: req.body.name ? req.body.name : found.name,
        role: req.body.role ? req.body.role : found.role,
    }

    db.splice(index, 1, employeeToUpdate)
    return res.status(201).send({
        success: 'true',
        message: 'employee updated successfully',
        employeeToUpdate
    })

})

const PORT = 5000;
app.listen(PORT, () => {
    console.log("Conneceted to PORT " + PORT)
});