//docker exec -it remitly_project-app-1 node /app/dist/scripts/importCsvToMongodb.js
import * as fs from 'fs';
import csv = require('csv-parser');
import mongoose from "mongoose";
import {BankInput, BankModel} from '../models/BankModel';
import 'dotenv/config';

interface CsvRow {
    'SWIFT CODE': string;
    'ADDRESS': string;
    'NAME': string;
    'COUNTRY ISO2 CODE': string;
    'COUNTRY NAME': string;
}

const convertedData: BankInput[] = [];

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:27017/${process.env.DB_NAME}?authSource=admin`)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


fs.createReadStream('/app/data/SWIFTcodes.csv')
    .pipe(csv())
    .on('data', (row: CsvRow) => {
        console.log('Parsed:', row);

        const isHeadquarter = row['SWIFT CODE'].endsWith('XXX');

        const bankData: BankInput = {
            address: row['ADDRESS'],
            bankName: row['NAME'],
            countryISO2: row['COUNTRY ISO2 CODE'].toUpperCase(),
            countryName: row['COUNTRY NAME'].toUpperCase(),
            isHeadquarter: isHeadquarter,
            swiftCode: row['SWIFT CODE'],
        };
        convertedData.push(bankData);
    })
    .on('end', async () => {
        console.log(convertedData);
        try {
            await BankModel.insertMany(convertedData);
            console.log('Data imported to MongoDB');
        } catch (error) {
            console.error('Failed to import data to MongoDB', error);
        } finally {
            await mongoose.disconnect();
        }
    })