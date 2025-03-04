import { Request, Response } from "express";
import { BankModel } from "../models/BankModel";

export const getSwiftCode = async (req: Request, res: Response) => {
    const swiftCode = req.params.swiftCode;

    try {
        const bank = await BankModel.findOne({ swiftCode }).exec();

        if (!bank) {
            return res.status(404).json({ message: "SWIFT code not found" });
        }

        let branches = [];
        if (bank.isHeadquarter) {
            branches = await BankModel.find({
                $and: [
                    { swiftCode: { $ne: bank.swiftCode } },
                    { swiftCode: new RegExp(`^${bank.swiftCode.slice(0, 8)}`) }
                ]
            }).select("-_id address bankName countryISO2 isHeadquarter swiftCode");

        }


        const responseData: any = {
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

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
