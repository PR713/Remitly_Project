import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 8080;

// Połączenie z MongoDB
mongoose.connect('mongodb://root:password@db:27017/swiftdb?authSource=admin')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.get('/', (req, res) => {
    res.send('Hello, Remitly!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});