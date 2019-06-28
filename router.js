const express = require('express');
const router = express.Router();

//Handle Employees
const {
    getAllEmployees,
    createNewEmployee,
    getSingleEmployee,
    deleteEmployee,
    updateEmployee,
    getInvalidRequests
} = require('./Employee/EmployeeController')

router.route('/employees')
    .get((req, res) => getAllEmployees(req, res))
    .post((req, res) => createNewEmployee(req, res))

router.route('/employee/:id')
    .get((req, res) => getSingleEmployee(req, res))
    .delete((req, res) => deleteEmployee(req, res))
    .put((req, res) => updateEmployee(req, res))

router.route('/*')
    .all((req, res) => getInvalidRequests(req, res))

module.exports = router;