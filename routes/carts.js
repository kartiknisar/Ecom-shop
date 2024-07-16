const express=require('express')
const cartsRepo=require('../repository/carts')
const productsRepo=require('../repository/products')
const cartShowTemplate=require('../views/carts/show')
 
const router=express.Router()

//receving apost request to add items to a carts
router.post('/cart/products',async(req,res)=>{
    //Figure out a cart
    
    let cart;
    if(!req.session.cartId){
       //we dont have a cart we need to create one 
       //and store that cardId on the res.sessioncardId
       //property
        cart= await cartsRepo.create({items:[]})
       req.session.cartId=cart.id;
    }else{

        //we have a cart! let get it from repository
         cart=await cartsRepo.getOne( req.session.cartId)
    }

    const existingItem=cart.items.find(item=>item.id===req.body.productId);

    if(existingItem)
    {//incremet the quantity and save cart
       existingItem.quantity++;
    }else{
        //add new product id to items array
        cart.items.push({id:req.body.productId, quantity:1})
    }
    await cartsRepo.update(cart.id,{
        items:cart.items
    })
    
    //res.send("Product added to cart")
      res.redirect('/cart')
})

//receive a get request  to show all the item in carts
router.get('/cart',async(req,res)=>{
    if(!req.session.cartId){
        return res.redirect('/');
        }
    const cart=await cartsRepo.getOne(req.session.cartId);

    for(let item of cart.items){
        const product= await productsRepo.getOne(item.id);
        item.product=product
    }

    res.send(cartShowTemplate({items:cart.items}))
})



router.post('/cart/products/delete' ,async(req,res)=>{
    const {itemId}=req.body;
    const cart=await cartsRepo.getOne(req.session.cartId)

    const items=cart.items.filter(item=>item.id !==itemId)

    await cartsRepo.update(req.session.cartId,{items})


    res.redirect('/cart');
})


module.exports=router