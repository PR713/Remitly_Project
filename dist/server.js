"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const mongoose_1 = __importDefault(require("mongoose"));
const port = parseInt((_a = process.env.APP_PORT) !== null && _a !== void 0 ? _a : '8080', 10);
if (process.env.NODE_ENV !== "test") {
    const server = index_1.default.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
    process.on('SIGINT', () => {
        server.close(() => {
            mongoose_1.default.connection.close().then(() => {
                console.log('Server and MongoDB connection closed');
                process.exit(0);
            });
        });
    });
}
