"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSwiftCode = exports.addNewSwiftCodeEntries = exports.getSwiftCodesByCountry = exports.getSwiftCode = void 0;
const BankModel_1 = require("../models/BankModel");
const getSwiftCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const swiftCode = req.params.swiftCode;
    try {
        const bank = yield BankModel_1.BankModel.findOne({ swiftCode }).exec();
        if (!bank) { //if not exists bank is null
            return res.status(404).json({ message: "SWIFT code not found" });
        }
        const responseData = {
            address: bank.address,
            bankName: bank.bankName,
            countryISO2: bank.countryISO2,
            countryName: bank.countryName,
            isHeadquarter: bank.isHeadquarter,
            swiftCode: bank.swiftCode,
        };
        let branches = [];
        if (bank.isHeadquarter) {
            branches = yield BankModel_1.BankModel.find({
                $and: [
                    { swiftCode: { $ne: bank.swiftCode } },
                    { swiftCode: new RegExp(`^${bank.swiftCode.slice(0, 8)}`) }
                ]
            }).select("-_id address bankName countryISO2 isHeadquarter swiftCode").exec();
            responseData.branches = branches;
        }
        return res.status(200).json(responseData);
    }
    catch (error) {
        console.error("Error in getSwiftCode", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getSwiftCode = getSwiftCode;
const getSwiftCodesByCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const countryISO2 = req.params.countryISO2code;
    try {
        const banks = yield BankModel_1.BankModel.find({ countryISO2 }).exec();
        if (banks.length === 0) { //if not exists banks = []
            return res.status(404).json({ message: "Country does not exist in database" });
        }
        return res.status(200).json({
            countryISO2,
            countryName: banks[0].countryName,
            swiftCodes: banks.map(bank => ({
                address: bank.address,
                bankName: bank.bankName,
                countryISO2: bank.countryISO2,
                isHeadquarter: bank.isHeadquarter,
                swiftCode: bank.swiftCode,
            }))
        });
    }
    catch (error) {
        console.error("Error in getSwiftCodesByCountry", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getSwiftCodesByCountry = getSwiftCodesByCountry;
const addNewSwiftCodeEntries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, bankName, countryISO2, countryName, isHeadquarter, swiftCode } = req.body;
    try {
        const existingBank = yield BankModel_1.BankModel.findOne({ swiftCode }).exec();
        if (existingBank) {
            return res.status(400).json({ message: "SWIFT code already exists!" });
        }
        const newBank = new BankModel_1.BankModel({
            address,
            bankName,
            countryISO2: countryISO2.toUpperCase(),
            countryName: countryName.toUpperCase(),
            isHeadquarter,
            swiftCode,
        });
        yield newBank.save();
        return res.status(201).json({ message: "SWIFT code added successfully" });
    }
    catch (error) {
        console.error("Error in addNewSwiftCodeEntries", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.addNewSwiftCodeEntries = addNewSwiftCodeEntries;
const deleteSwiftCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const swiftCode = req.params.swiftCode;
    try {
        const bank = yield BankModel_1.BankModel.findOne({ swiftCode }).exec();
        if (!bank) { //if not exists bank is null
            return res.status(404).json({ message: "SWIFT code not found" });
        }
        if (bank.isHeadquarter) {
            let branches;
            branches = yield BankModel_1.BankModel.find({
                $and: [
                    { swiftCode: { $ne: bank.swiftCode } },
                    { swiftCode: new RegExp(`^${bank.swiftCode.slice(0, 8)}`) }
                ]
            }).select("-_id address bankName countryISO2 isHeadquarter swiftCode").exec();
            if (branches.length > 0) {
                return res.status(400).json({ message: "Cannot delete headquarters! It has existing branches." +
                        "Delete branches first." });
            }
        }
        yield BankModel_1.BankModel.findOneAndDelete({ swiftCode });
        return res.status(200).json({ message: "SWIFT code deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleteSwiftCode", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteSwiftCode = deleteSwiftCode;
