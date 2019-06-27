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

employees.post('save', function(error, doc, next) {
   console.log(error)
   
   let anArray = []
   let messages =  Object.keys(error.errors);
   for (let i=0; i<messages.length; ++i){
     const x= {
       ErrorMissingField:"The " + messages[i] + " is missing"
      }
      anArray.push(x)
   }

   
   console.log(messages);
   next(anArray);
 });
 

module.exports = mongoose.model('employees', employees)
