import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { placeOrder, userOrders, verifyOrder, listOrders, updateStatus } from "../controllers/order.controller.js";

const orderRouter = express.Router();


// Place order route
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post('/verify', authMiddleware, verifyOrder); 
orderRouter.post('/userorders', authMiddleware, userOrders);
orderRouter.get('/list', listOrders);
orderRouter.post("/status", updateStatus)

// Export the order router
export default orderRouter;