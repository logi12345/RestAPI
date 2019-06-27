const mongoose = require('mongoose');

const employees = mongoose.Schema({
   _id: Number,
   name: {
      type:String,
      required: [true, 'name required']
   },
   role: String,
   salary: {
      type:mongoose.Decimal128,
      required: [true, 'salary required']
   },
   age: {type:Number,
      required: [true, 'age required']
   },
   profile_image: String
})

module.exports = mongoose.model('employees', employees)

// db.createCollection( "employees", {
//    validator: { $jsonSchema: {
//       bsonType: "object",
//       required: [ "employee_name", "employee_salary", "employee_age" ],
//       properties: {
//          _id: {
//             bsonType: "int",
//             description: "User id"
//          },
//          employee_name: {
//             bsonType: "string",
//             description: "must be a string and is required"
//          },
//          employee_role: {
//             bsonType : "string",
//             description: "position"
//          },
//          employee_salary: {
//             bsonType: "double",
//             description: "must be a string and is required"
//          },
//          employee_age: {
//             bsonType: "int",
//             description: "must be a string and is required"
//          },
//          profile_picture: {
//             bsonType: "string",
//             description: "must be a string and is required"
//          }
//       }
//    }},
//    validationAction: "error"
// })