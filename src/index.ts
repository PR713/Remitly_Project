import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 8080;

// Połączenie z MongoDB
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:27017/${process.env.DB_NAME}?authSource=admin`)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


app.get('/', (req, res) => {
    res.send('Hello, Remitly!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


//TODO mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@db:27017/swiftdb?authSource=admin`);