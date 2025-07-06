import express from "express"
import { addTocart, removeFromCart, getCart } from "../controllers/cart.controller.js"
import authMiddleware from '../middleware/auth.middleware.js';


const cartRouter = express.Router();

cartRouter.post('/add',authMiddleware, addTocart);
cartRouter.post('/remove', authMiddleware, removeFromCart);
cartRouter.post('/get', authMiddleware, getCart);

export default cartRouter;