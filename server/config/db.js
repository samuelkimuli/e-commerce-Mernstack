const mongoose = require("mongoose")
const config = require('./keys')
const db = config.mongoURI

const connectDB = async () => {
    try {
        await mongoose.connect(db, 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
              }
            )
            console.log('connected to the database')
    } catch(err){
        console.log("connection failed")
        process.exit(1)
    }
}


module.exports = connectDB