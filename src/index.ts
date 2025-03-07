import 'dotenv/config';
import express, {Application} from 'express';
import mongoose from 'mongoose';
import swiftCodeRoutes from "./routes/swiftCodeRoutes";


const app: Application = express();
const port: number = parseInt(process.env.APP_PORT ?? '8080', 10);

// Connection to MongoDB, default connect()
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:27017/${process.env.DB_NAME}?authSource=admin`)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err: unknown) => console.error('Failed to connect to MongoDB', err));

app.use(express.json());

app.use('/v1', swiftCodeRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});