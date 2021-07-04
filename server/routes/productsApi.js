const express = require("express")
const router = express.Router()
const auth = require("../middleware/authorization")
const {check, validationResult} = require("express-validator")
const Product = require("../models/Product")


router.post("/", 
[ auth, 
[
    check("name", "name is required please").not().isEmpty(),
    check("description", "description is required please").not().isEmpty(),
    check("category", "category is required please").not().isEmpty(),
    check("price", "price is required please").not().isEmpty(),
    check("quantity", "quantity is required please").not().isEmpty(),
]
], 
async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res
        .status(400)
        .json({errors:errors.array()})
    }

    try {
        const {name,description,category,price,quantity} = req.body
        const newProduct = await new Product({
            userId: req.user.id,
            name,
            description,
            category,
            price,
            quantity,
        })
        const product = newProduct.save()
        res.json({product})

    } catch (error) {
        console.error(error.message)
        res.status(500).send('sorry there seems to be a problem')
        
    }
})
router.get("/", (req,res) => res.send("This is the product route"))

module.exports = router