import fs from 'fs';
import csv from 'csv-parser';
import mongoose from "mongoose";
import { BankModel } from '../models/BankModel';
import 'dotenv/config';

const convertedData: any[] = [];

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:27017/${process.env.DB_NAME}?authSource=admin`)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


fs.createReadStream('src/data/SWIFTcodes.csv')
    .pipe(csv())
    .on('data', (row) => {

        const bankData = {
            countryISO2Code: row.countryISO2Code,
            swiftCode: row.swiftCode,
            codeType: row.codeType,
            name: row.name,
            address: row.address,
            townName: row.townName,
            countryName: row.countryName,
            timeZone: row.timeZone,
        };
        convertedData.push(bankData);
    })
    .on('end', async () => {
        try {
            await BankModel.insertMany(convertedData);
            console.log('Data imported to MongoDB');
        } catch (error) {
            console.error('Failed to import data to MongoDB', error);
        } finally {
            await mongoose.disconnect();
        }
    })