const Employee = require('./EmployeeSchema')
//http request status
const SUCCESS = "ok";
const FAIL = "error";


const { messages,createEmployeeResponses,responseText } = require('./ResponseHandler');
employees = Employee;

const getAllEmployees = (req, res) => {
    employees.find({}, function (err, result) {
        if (err) {
            throw err
        }
        responseText(res, 200, SUCCESS, [], createEmployeeResponses(null, result));
    })
}

const createNewEmployee = (req, res) => {
    employees.find({}, (err, result) => {
        if (err) {
            throw err
        }
        let lastElementID = result.length === 0 ? 0 : parseInt(result[(result.length) - 1].id);

        const employee = new Employee({
            _id: lastElementID + 1,
            name: req.body.name,
            role: req.body.role ? req.body.role : "",
            salary: req.body.salary,
            age: req.body.age,
            profile_image: req.body.profile_image ? req.body.profile_image : ""
        })
        employee.save().then(result => {

            responseText(res, 200, SUCCESS, [messages.EMP_CREATED], createEmployeeResponses(employee, null))
        }).catch((err) => {
            responseText(res, 404, FAIL, err, createEmployeeResponses(employee, null))
        })
    })
}

const getSingleEmployee = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const employee = await employees.findOne({
            _id: id
        })

        if (!employee) {
            return responseText(res, 404, FAIL, [messages.EMP_NOT_FOUND], createEmployeeResponses(null, null))
        }
        responseText(res, 200, SUCCESS, [messages.EMP_FOUND], createEmployeeResponses(employee, null))
    } catch (error) {
        responseText(res, 500, FAIL, [messages.UNEXPECTED_ERROR], createEmployeeResponses(null, null))
    }
}

const deleteEmployee = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const employee = await employees.findOne({
        _id: id
    })
    if (employee === null) {
        responseText(res, 404, FAIL, [messages.EMP_NOT_FOUND], createEmployeeResponses(null, null));
    } else {
        const employeeToDelete = await employees.deleteOne({
            _id: id
        })
        responseText(res, 200, SUCCESS, [messages.EMP_DELETED], createEmployeeResponses(employee, null));
    }
}


const updateEmployee = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!req.body.name && !req.body.role && !req.body.salary && !req.body.age && !req.body.profile_imag) {
        responseText(res, 400, FAIL, [messages.NOTH_UPDATE], createEmployeeResponses(null, null));
        return
    }
    employees.findOne({
        _id: id
    }, function (err, employee) {
        if (employee !== null) {
            console.log(employee)
            employee.name = req.body.name ? req.body.name : "",
            employee.role = req.body.role ? req.body.role : "",
            employee.salary = req.body.salary ? req.body.salary : "",
            employee.age = req.body.age ? req.body.age : "",
            employee.profile_image = req.body.profile_image ? req.body.profile_image : ""
            employee.save().then(
                (result) => {
                    console.log(result)
                    if (result) {
                        return responseText(res, 200, SUCCESS, [messages.EMP_UPDATED], createEmployeeResponses(result, null));
                    } else {
                        return responseText(res, 404, FAIL, [messages.EMP_NOT_FOUND], createEmployeeResponses(null, null));
                    }
                }
            ).catch((err) => {
                responseText(res, 404, FAIL, err, createEmployeeResponses(employee, null))
            })
        } else {
            responseText(res, 404, FAIL, [messages.EMP_NOT_UPDATED], createEmployeeResponses(employee, null))
        }
    });
}

const getInvalidRequests = (req, res) => {
    responseText(res, 405, FAIL, [messages.NOT_ALLOWED], createEmployeeResponses(null, null));
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    getSingleEmployee,
    deleteEmployee,
    updateEmployee,
    getInvalidRequests
}