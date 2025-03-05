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
exports.getSwiftCode = void 0;
const BankModel_1 = require("../models/BankModel");
const getSwiftCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const swiftCode = req.params.swiftCode;
    try {
        const bank = yield BankModel_1.BankModel.findOne({ swiftCode }).exec();
        if (!bank) {
            return res.status(404).json({ message: "SWIFT code not found" });
        }
        let branches = [];
        if (bank.isHeadquarter) {
            branches = yield BankModel_1.BankModel.find({
                $and: [
                    { swiftCode: { $ne: bank.swiftCode } },
                    { swiftCode: new RegExp(`^${bank.swiftCode.slice(0, 8)}`) }
                ]
            }).select("-_id address bankName countryISO2 isHeadquarter swiftCode");
        }
        const responseData = {
            address: bank.address,
            bankName: bank.bankName,
            countryISO2: bank.countryISO2,
            countryName: bank.countryName,
            isHeadquarter: bank.isHeadquarter,
            swiftCode: bank.swiftCode,
        };
        if (bank.isHeadquarter) {
            responseData.branches = branches;
        }
        return res.json(responseData);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getSwiftCode = getSwiftCode;
