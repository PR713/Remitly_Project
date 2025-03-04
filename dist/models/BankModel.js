"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const bankSchema = new Schema({
    countryISO2Code: String,
    swiftCode: String,
    codeType: String,
    name: String,
    address: String,
    townName: String,
    countryName: String,
    timeZone: String,
});
exports.BankModel = mongoose_1.default.model('Bank', bankSchema);
