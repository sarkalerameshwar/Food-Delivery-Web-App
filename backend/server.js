import 'dotenv/config'
import express from 'express';
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import foodRouter from './routes/food.route.js';
import userRouter from './routes/user.route.js';
import cartRouter from './routes/cart.route.js';
import orderRouter from './routes/order.route.js';


const app = express()
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

// db connection 
connectDB();

// api endpoint
app.use('/api/food', foodRouter);
app.use('/image',express.static('uploads'));
app.use('/api/user',userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(express.static(path.join(__dirname, '../admin/dist')));

// SPA fallback for frontend
app.get('/app/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// SPA fallback for admin
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/dist', 'index.html'));
});

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
})
