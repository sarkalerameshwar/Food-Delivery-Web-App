import userModel from "../models/user.model.js"


// add items to user cart
const addTocart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.user.id);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        let cartData = userData.cartData || {};
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.user.id, { cartData });
        res.json({ message: "Item added to cart" });
    } catch (err) {
        res.status(500).json({ message: "Error adding item to cart", error: err.message });
    }
};

// remove items from cart
const removeFromCart = async(req, res)=>{
    try{
        let userData = await userModel.findById(req.user.id);
        let cartData = await userData.cartData;
        if(cartData[req.body.itemId] > 0){
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.user.id, {cartData});
        res.json({message: "Item removed from cart"}); 
    }catch(err){
        console.log(err);
        res.status(400).json({message:"cart data not deleted"});
    }
}

// fetch user cart data
const getCart = async(req, res) =>{
    try{
        let userData = await userModel.findById(req.user.id);
        let cartData = await userData.cartData || {};
        res.status(200).json({cartData});
    }catch(err){
        console.log(err);
        res.status(400).json({message:"cart data not found"});
    }
}

export {addTocart, removeFromCart, getCart}