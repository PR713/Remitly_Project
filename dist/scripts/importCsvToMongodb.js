"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const csv = require("csv-parser");
const mongoose_1 = __importDefault(require("mongoose"));
const BankModel_1 = require("../models/BankModel");
require("dotenv/config");
const convertedData = [];
mongoose_1.default.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:27017/${process.env.DB_NAME}?authSource=admin`)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));
fs.createReadStream('/app/data/SWIFTcodes.csv')
    .pipe(csv())
    .on('data', (row) => {
    console.log('Parsed:', row);
    const isHeadquarter = row['SWIFT CODE'].endsWith('XXX');
    const bankData = {
        address: row['ADDRESS'], //mapuję nazwy pól z CSV
        bankName: row['NAME'],
        countryISO2: row['COUNTRY ISO2 CODE'].toUpperCase(),
        countryName: row['COUNTRY NAME'].toUpperCase(),
        isHeadquarter: isHeadquarter,
        swiftCode: row['SWIFT CODE'],
    };
    convertedData.push(bankData);
})
    .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(convertedData);
    try {
        yield BankModel_1.BankModel.insertMany(convertedData);
        console.log('Data imported to MongoDB');
    }
    catch (error) {
        console.error('Failed to import data to MongoDB', error);
    }
    finally {
        yield mongoose_1.default.disconnect();
    }
}));
