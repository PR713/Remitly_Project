import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import swiftCodeRoutes from "./routes/swiftCodeRoutes";

const app = express();
const port = 8080;

// Połączenie z MongoDB
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:27017/${process.env.DB_NAME}?authSource=admin`)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


app.get('/', (req, res) => {
    res.send('Hello, Remitly!');
});

app.use('/v1', swiftCodeRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});