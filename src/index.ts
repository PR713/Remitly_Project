import 'dotenv/config';
import express, {Application} from 'express';
import mongoose from 'mongoose';
import swiftCodeRoutes from "./routes/swiftCodeRoutes";
import {Request, Response} from "express";

export const app: Application = express();
const port: number = parseInt(process.env.APP_PORT ?? '8080', 10);

// Connection to MongoDB, default connect()
if (process.env.NODE_ENV !== "test") {
    mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:27017/${process.env.DB_NAME}?authSource=admin`)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err: unknown) => console.error('Failed to connect to MongoDB', err));
}


app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Remitly!');
});

app.use('/v1', swiftCodeRoutes);

export const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});