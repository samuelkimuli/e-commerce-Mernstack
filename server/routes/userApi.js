const express = require("express")
const router = express.Router()
const {check,validationResult} = require("express-validator")
const User = require("../models/Users")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const keys = require("../config/keys")


router.get("/", (req,res) => res.send("This is the user route"))

router.post(
    "/",

    [

    check("name", "name is required").not().isEmpty(), 
    check("email","please enter a valid email").isEmail(),
    check("password","your password should have a minimum of five characters").isLength({min:5}),

    ],
    
   async (req,res) => {

        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({errors:errors.array()})
        }
        try {
            console.log(req.body)
            const{name,email,password} = req.body
            let user = await User.findOne({email:email})
            if(user){
                return res.status(400).json({errors:[{msg:"user already exists"}]})
            }
            user = new User({
                name,
                email,
                password,
            })
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password,salt)
            user.save()
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