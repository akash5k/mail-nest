import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import mailRoutes from './routes/mailRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDatabase from './config/database.js';
import cookieParser from 'cookie-parser';

dotenv.config();

connectDatabase();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

app.use('/api/users',userRoutes);

app.use('/api/mail',templateRoutes);

app.use('/api/',mailRoutes);

app.get('/',(req,res)=>{
    res.send('Server is ready');
})

app.use(notFound);
app.use(errorHandler);

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
})