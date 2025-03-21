"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const swiftCodeRoutes_1 = __importDefault(require("./routes/swiftCodeRoutes"));
exports.app = (0, express_1.default)();
// Connection to MongoDB, default connect()
if (process.env.NODE_ENV !== "test") {
    mongoose_1.default.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:27017/${process.env.DB_NAME}?authSource=admin`)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('Failed to connect to MongoDB', err));
}
exports.app.use(express_1.default.json());
exports.app.get('/', (req, res) => {
    res.send('Hello, Remitly!');
});
exports.app.use('/v1', swiftCodeRoutes_1.default);
// exporting app without launching the server
exports.default = exports.app;
