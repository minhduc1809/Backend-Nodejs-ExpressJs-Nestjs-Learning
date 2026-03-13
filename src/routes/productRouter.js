const express = require('express');
const router = express.Router();

const Product = require('../models/Product');

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/',async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
    });
    try{
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req,res) => {
    try{
        const product =await Product.findById(req.params.id);
        if(!product) return res.status(404).json({error: 'Product not found'});
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.put('/:id', async (req,res) => {
    try{
        const updatedProduct =await Product.findByIdAndUpdate(req.params.id, req.body,{new:true});
        if(!updatedProduct) return res.status(404).json({error: 'Product not found'});
        res.status(201).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.delete('/:id', async (req,res) => {
    try{
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if(!deletedProduct) return res.status(404).json({error: 'Product not found'});
        res.status(200).json("Delete completed!" + deletedProduct.name);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router; 