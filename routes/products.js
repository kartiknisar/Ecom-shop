const express=require('express');
const productsRepo=require('../repository/products')
const productIndexTemplates=require('../views/products/index')

const router=express.Router();

router.get('/',async (req,res)=>{
const products=await productsRepo.getAll();
res.send (productIndexTemplates({products}))
}) 


module.exports=router