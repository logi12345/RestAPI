
//Error Message Store
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

//Setup response
const responseText = (res, errorCode, isSuccessString, message, result) => {
    res.status(errorCode).send({
        status: isSuccessString,
        code:errorCode,
        messsage: message, result})
}

module.exports = {
    messages,
    createEmployeeResponses,
    responseText
}