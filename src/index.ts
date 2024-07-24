import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import couponRoutes from './routes/coupon.routes';
import authRoutes from './routes/auth.routes';
import newsRoutes from './routes/newsPost.routes';
import authenticate from './middlewares/authorize';

const app = express();

// const publicPath = path.resolve(__dirname, '../public');

const port = 3000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(authenticate);
app.use(userRoutes);
app.use(newsRoutes);
app.use(couponRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
}); 