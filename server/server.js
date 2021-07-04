//import the express module,create express app,set port, import database config
const express = require("express")
const app = express()
const PORT = process.env.PORT || 5000
const connectDB = require("./config/db")

//establish database connection
connectDB()

//middleware
app.use(express.json({extended:false}))
app.use("/api/users", require("./routes/userApi"))
app.use("/api/products", require("./routes/productsApi"))
app.use("/api/auth", require("./routes/authApi"))

//routes
app.get("/", (req,res) => {
    res.send("my app is up and running")
})


app.listen(PORT, ()=>{
    console.log(`The server is listening at port ${PORT}`)
})
