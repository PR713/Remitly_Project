"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bankSchema = new mongoose_1.default.Schema({
    address: { type: String, required: true },
    bankName: { type: String, required: true },
    countryISO2: { type: String, required: true, uppercase: true },
    countryName: { type: String, required: true, uppercase: true },
    isHeadquarter: { type: Boolean, required: true },
    swiftCode: { type: String, required: true, unique: true },
});
exports.BankModel = mongoose_1.default.model("Bank", bankSchema);
