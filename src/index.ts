import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { json } from 'stream/consumers';

const app = express();

// const publicPath = path.resolve(__dirname, '../public');

const port = 3000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

app.listen(port, () => {

    console.log(`Servidor corriendo en puerto ${port}`);
});