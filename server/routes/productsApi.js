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
        console.log(req.body)
        const {name,description,category,price,brand,quantity} = req.body
        const newProduct =  new Product({
            userId: req.user.id,
            name,
            description,
            category,
            price,
            brand,
            quantity,
        })
        const product = await newProduct.save()
        res.json({product})

    } catch (error) {
        console.error(error.message)
        res.status(500).send('sorry there seems to be a problem')
        
    }
})

//get all products
router.get("/", async (req,res) => {
    try {
        const products = await Product.find()
        res.json({products})
        
    } catch (error) {
        console.error(error.message)
        res
        .status(500)
        .send("something is wrong")
        
    }
})

//get a particular product
router.get("/:id", async (req,res) => {
    try {
        const product = await Product.findById(req.params.id)
        if(!product) {
          return res
          .status(404).
          json({msg:"product not found"})
    }
    res.json({product})
    } catch (error) {
        console.error(error.message)
        res
        .status(500)
        .send("something is wrong")
    }
})

module.exports = router