import * as fs from 'fs';
import csv = require('csv-parser');
import mongoose from "mongoose";
import { BankModel } from '../models/BankModel';
import 'dotenv/config';

const convertedData: any[] = [];

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:27017/${process.env.DB_NAME}?authSource=admin`)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


fs.createReadStream('/app/data/SWIFTcodes.csv')
    .pipe(csv())
    .on('data', (row) => {
        console.log('Parsed:', row);
        const bankData = {
            countryISO2Code: row['COUNTRY ISO2 CODE'], //mapuję nazwy pól z CSV
            swiftCode: row['SWIFT CODE'],
            codeType: row['CODE TYPE'],
            name: row['NAME'],
            address: row['ADDRESS'],
            townName: row['TOWN NAME'],
            countryName: row['COUNTRY NAME'],
            timeZone: row['TIME ZONE'],
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