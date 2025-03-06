import { Request, Response } from "express";
import { BankModel } from "../models/BankModel";

interface Branch {
    address: string;
    bankName: string;
    countryISO2: string;
    countryName: string;
    isHeadquarter: boolean;
    swiftCode: string;
}

export const getSwiftCode = async (req: Request, res: Response) => {
    const swiftCode = req.params.swiftCode;

    try {
        const bank = await BankModel.findOne({ swiftCode }).exec();

        if (!bank) { //if not exists bank is null
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

        let branches: Branch[] = [];
        if (bank.isHeadquarter) {
            branches = await BankModel.find({
                $and: [
                    { swiftCode: { $ne: bank.swiftCode } },
                    { swiftCode: new RegExp(`^${bank.swiftCode.slice(0, 8)}`) }
                ]
            }).select("-_id address bankName countryISO2 isHeadquarter swiftCode").exec();

            responseData.branches = branches;
        }

        return res.status(200).json(responseData);

    } catch (error) {
        console.error("Error in getSwiftCode", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};




export const getSwiftCodesByCountry = async (req: Request, res: Response) => {
    const countryISO2 = req.params.countryISO2code;

    try {
        const banks = await BankModel.find({countryISO2}).exec();

        if (banks.length === 0) { //if not exists banks = []
            return res.status(404).json({message: "Country does not exist in database"})
        }

        return res.status(200).json({
            countryISO2,
            countryName: banks[0].countryName,
            swiftCodes: banks.map( bank => ({ //or .select(...)
                address: bank.address,
                bankName: bank.bankName,
                countryISO2: bank.countryISO2,
                isHeadquarter: bank.isHeadquarter,
                swiftCode: bank.swiftCode,
            }))
        });
    } catch (error) {
        console.error("Error in getSwiftCodesByCountry", error);
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
        console.error("Error in addNewSwiftCodeEntries", error);
        return res.status(500).json({message: "Internal server error" });
    }
};




export const deleteSwiftCode = async (req: Request, res: Response) => {

    const swiftCode = req.params.swiftCode;

    try {
        const bank = await BankModel.findOne({ swiftCode }).exec();

        if (!bank) { //if not exists bank is null
            return res.status(404).json({ message: "SWIFT code not found" });
        }


        if (bank.isHeadquarter) {
            let branches: Branch[];

            branches = await BankModel.find({
                $and: [
                    { swiftCode: { $ne: bank.swiftCode } },
                    { swiftCode: new RegExp(`^${bank.swiftCode.slice(0, 8)}`) }
                ]
            }).select("-_id address bankName countryISO2 isHeadquarter swiftCode").exec();


            if (branches.length > 0) {
                return res.status(400).json({message: "Cannot delete headquarters! It has existing branches." +
                        "Delete branches first."})
            }
        }
        

        await BankModel.findOneAndDelete({swiftCode});

        return res.status(200).json({message: "SWIFT code deleted successfully"});
    } catch (error) {
        console.error("Error in deleteSwiftCode", error);
        return res.status(500).json({message: "Internal server error"});
    }
}
