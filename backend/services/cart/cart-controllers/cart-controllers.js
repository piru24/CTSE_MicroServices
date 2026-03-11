const Cart = require("../model/cart");

//add Cart
const addCart = async (req, res, next) => {
    
    let cart;
    try {
        cart = new Cart({
            user: req.userId,
            cartItems : req.body.cartItems
      });
      await cart.save();
    } catch (err) {
      console.log(err);
    }
    if (!cart) {
      return res.status(500).json({ message: "Unable to add" });
    }
    return res.status(201).json(cart);
  };


const updateCart = async(req, res, next)=>{
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
}

const deleteCart = async(req, res, next)=>{
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
}

const getCart = async(req, res, next)=>{
  try {
    const cart = await Cart.findOne({ user: req.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
}

const getAllCarts = async(req, res, next) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
}

  exports.addCart = addCart;
  exports.updateCart = updateCart;
  exports.deleteCart = deleteCart;
  exports.getCart = getCart;
  exports.getAllCarts = getAllCarts;