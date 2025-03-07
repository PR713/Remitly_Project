import mongoose, { Document } from "mongoose";

export interface BankInput {
    address: string;
    bankName: string;
    countryISO2: string;
    countryName: string;
    isHeadquarter: boolean;
    swiftCode: string;
}


export interface BankResponse {
    address: string;
    bankName: string;
    countryISO2: string;
    countryName: string;
    isHeadquarter: boolean;
    swiftCode: string;
    branches?: Branch[];
}


export interface Branch {
    address: string;
    bankName: string;
    countryISO2: string;
    countryName: string;
    isHeadquarter: boolean;
    swiftCode: string;
}


export interface IBank extends Document {
    address: string;
    bankName: string;
    countryISO2: string;
    countryName: string;
    isHeadquarter: boolean;
    swiftCode: string;
}


const bankSchema = new mongoose.Schema({
    address: { type: String, required: true },
    bankName: { type: String, required: true },
    countryISO2: { type: String, required: true, uppercase: true },
    countryName: { type: String, required: true, uppercase: true },
    isHeadquarter: { type: Boolean, required: true },
    swiftCode: { type: String, required: true, unique: true },
});

export const BankModel = mongoose.model<IBank>("Bank", bankSchema);
