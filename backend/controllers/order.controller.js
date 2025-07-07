import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import Stripe from "stripe";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url =  "http://localhost:5173" || "http://localhost:5174"; // Update with your frontend URL
  // const admin_url = "http://localhost:5174";

  try {
    const { items, amount, address } = req.body;
    
    if (!items || !amount || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Create temporary order with payment: false
    const newOrder = new orderModel({
      userId: req.user.id,
      items:req.body.items,
      amount: req.body.amount,
      address: req.body.address
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, {cartData: {}});


    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100*80,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charge" },
        unit_amount: 2*100*80,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      metadata: {
        orderId: newOrder._id.toString()
      }
    });

    res.json({
      success: true,
      message: "Payment initiated",
      session_url: session.url,
      orderId: newOrder._id
    });

  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initiate payment"
    });
  }
};

const verifyOrder = async (req, res) => {
  try {
    const { success, session_id, orderId } = req.body;

    if (success) {
      // Verify with Stripe if session_id exists
      if (session_id) {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status !== 'paid') {
          return res.status(400).json({
            success: false,
            message: "Payment not completed"
          });
        }
      }

      // Update order payment status
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        { payment: true },
        { new: true },
        
      );

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      return res.json({
        success: true,
        message: "Payment verified successfully",
        order: updatedOrder
      });
    }

    // If payment failed, delete the temporary order
    await orderModel.findByIdAndDelete(orderId);
    res.json({
      success: true,
      message: "Order cancelled - payment not completed"
    });

  } catch (error) {
    console.error("Error in verifyOrder:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify order"
    });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error in userOrders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};

// listings orders for admin panel
const listOrders = async (req, res) => {
    try{
      const orders = await orderModel.find({})
      res.status(200).json({success:true, orders});
    }catch(error){
      console.error("Error in listOrders:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch orders"
      });
    }
}

// api for updating order status
const updateStatus = async(req, res)=>{
    try{
      await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
      res.json({success:true, message:"Order status updated"});

    }catch(error){
      console.error("Error in updateStatus:", error);
      res.status(500).json({success:false, message:"error"});
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };