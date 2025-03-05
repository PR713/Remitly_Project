import { Request, Response } from "express";
import { BankModel } from "../models/BankModel";


export const getSwiftCode = async (req: Request, res: Response) => {
    const swiftCode = req.params.swiftCode;

    try {
        const bank = await BankModel.findOne({ swiftCode }).exec();

        if (!bank) {
            return res.status(404).json({ message: "SWIFT code not found" });
        }

        const responseData: any = {
            address: bank.address,
            bankName: bank.bankName,
            countryISO2: bank.countryISO2,
            countryName: bank.countryName,
            isHeadquarter: bank.isHeadquarter,
            swiftCode: bank.swiftCode,
        };

        let branches = [];
        if (bank.isHeadquarter) {
            branches = await BankModel.find({
                $and: [
                    { swiftCode: { $ne: bank.swiftCode } },
                    { swiftCode: new RegExp(`^${bank.swiftCode.slice(0, 8)}`) }
                ]
            }).select("-_id address bankName countryISO2 isHeadquarter swiftCode");

            responseData.branches = branches;
        }

        return res.json(responseData);

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};




export const getSwiftCodesByCountry = async (req: Request, res: Response) => {
    const countryISO2 = req.params.countryISO2code;

    try {
        const banks = await BankModel.find({countryISO2}).exec();

        if (!banks) {
            return res.status(404).json( {message: "Country does not exist in database"})
        }

        return res.json({
            countryISO2,
            countryName: banks[0].countryName,
            swiftCodes: banks.map( bank => ({
                address: bank.address,
                bankName: bank.bankName,
                countryISO2: bank.countryISO2,
                isHeadquarter: bank.isHeadquarter,
                swiftCode: bank.swiftCode,
            }))
        });
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}




export const addNewSwiftCodeEntries = async (req: Request, res: Response) => {
    const { address, bankName, countryISO2, countryName, isHeadquarter, swiftCode } = req.body;

    try {
        const existingBank = await BankModel.findOne({swiftCode}).exec();
        if (existingBank) {
            return res.status(400).json({message: "SWIFT code already exists!"});
        }

        const newBank = new BankModel({
            address,
            bankName,
            countryISO2: countryISO2.toUpperCase(),
            countryName: countryName.toUpperCase(),
            isHeadquarter,
            swiftCode,
        });

        await newBank.save();

        return res.status(201).json({message: "SWIFT code added successfully" });
    } catch (error) {
        console.error("Error", error);
        return res.status(500).json({message: "Internal server error" });
    }
};