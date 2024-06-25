import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

const app = express();

// const publicPath = path.resolve(__dirname, '../public');

const port = 3000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use(authRoutes);


app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});