db.createCollection( "employees", {
   validator: { $jsonSchema: {
      bsonType: "object",
      required: [ "employee_name", "employee_salary", "employee_age" ],
      properties: {
         _id: {
            bsonType: "int",
            description: "User id"
         },
         employee_name: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         employee_role: {
            bsonType : "string",
            description: "position"
         },
         employee_salary: {
            bsonType: "double",
            description: "must be a string and is required"
         },
         employee_age: {
            bsonType: "int",
            description: "must be a string and is required"
         },
         profile_picture: {
            bsonType: "string",
            description: "must be a string and is required"
         }
      }
   }},
   validationAction: "error"
})