const jwt = require("jsonwebtoken")
const keys = require("../config/keys")

module.exports = function(req,res,next){
    const token = req.header("x-auth-token")

    if (!token){
        return res.status(401).json({msg:"You don't have the right access please"})
    }
    try {
        const decoded = jwt.verify(token,keys.jwtsecret)
        req.user = decoded.user
        next()
    } catch (error) {
        res.status(401).json({msg:"invalid token"})
        
    }
}