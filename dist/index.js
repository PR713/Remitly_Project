"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const port = 8080;
// Połączenie z MongoDB
mongoose_1.default.connect('mongodb://root:password@db:27017/swiftdb?authSource=admin')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));
app.get('/', (req, res) => {
    res.send('Hello, Remitly!');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
