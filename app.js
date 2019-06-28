//npm packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./router');

//internal modules
const url = 'mongodb://127.0.0.1:27017/company';
let db;
const PORT = 5000;
const app = express();

//Setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//Database Connection
mongoose.connect(url,{useNewUrlParser:true})
db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/api/v2', router);

app.listen(PORT, () => {
    console.log("Connected to PORT " + PORT);
});

module.exports = app
