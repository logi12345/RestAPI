const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')()

const employees = mongoose.Schema({
   _id: Number,
   name: {
      type:String,
      required: [true, 'Name Required']
   },
   role: String,
   salary: {
      type:Number,// type:mongoose.Decimal128,
      required: [true, 'Salary Required']
   },
   age: {type:Number,
      required: [true, 'Age Required']
   },
   profile_image: String
})

employees.plugin(mongooseHidden, { hidden: { _id: false} })
employees.post('save', function(error, doc, next) {
   let anArray = []
   let messages =  Object.keys(error.errors);
   messages.forEach(message => {
      const errorMessage = error.errors[message].message
     const JSONErrorMessage= {
       ErrorMessage:errorMessage
     }
      anArray.push(JSONErrorMessage)
   });
   next(anArray);
 });
 

module.exports = mongoose.model('employees', employees)
