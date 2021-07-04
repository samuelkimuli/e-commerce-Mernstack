const express = require("express")
const router = express.Router()
const auth = require("../middleware/authorization")
const User = require("../models/Users")
const {check,validationResult} = require("express-validator")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const keys = require("../config/keys")



router.get("/", auth , async (req,res) => {
    try {
        console.log(req.user)
        const user = await User.findById(req.user.id).select("-password")
        console.log(user)
        res.json(user)

    } catch (error) {
        console.error(error.message)
 
    }
})

router.post(
    "/",

    [

    check("email","please enter a valid email").isEmail(),
    check("password","password is required").exists(),

    ],
    
   async (req,res) => {

        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({errors:errors.array()})
        }
        try {
            console.log(req.body)
            const{email,password} = req.body
            let user = await User.findOne({email:email})
            if(!user){
                return res
                .status(400)
                .json({errors:[{msg:"invalid username or password"}]})
            }
            const match = await bcrypt.compare(password, user.password)
            if (!match){
                return res
                .status(400)
                .json({errors:[{msg:"invalid username or password"}]})
            }
            const payload = {
                user:{
                    id:user.id,
                },
            }
            jwt.sign(
                payload,
                keys.jwtsecret, 
                {expiresIn:3600 * 24}, 
                (err, token) => {
                    if(err) throw err
                    res.json({token})

            })
            //res.send("user created")
            
        } catch (error) {

            console.log(error)
            res.status(500).send("ooops something is not right")
            
        }
       
    }
    
)


module.exports = router