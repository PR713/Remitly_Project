import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bankSchema =  new Schema({
    countryISO2Code: String,
    swiftCode: String,
    codeType: String,
    name: String,
    address: String,
    townName: String,
    countryName: String,
    timeZone: String,
});

export const BankModel = mongoose.model('Bank', bankSchema);