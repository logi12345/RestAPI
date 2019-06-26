
const mongodb = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';


 const dbName = "company"

 const handleConnection = (db,callback) => {
    mongodb.connect(url, {
        useNewUrlParser: true
    }, (err, client) => {
        if (err) {
            console.error(err)
            return
        }
        db = client.db(dbName);
        callback(db)
    })
}

module.exports = {
    handleConnection,
}